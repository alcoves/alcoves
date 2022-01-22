import useSWR from 'swr'
import useUser from '../hooks/useUser'
import { fetcher } from '../utils/axios'
import { Flex, Progress, Text } from '@chakra-ui/react'

const twoGbInMb = 2000

export default function UsageQuota() {
  const { user } = useUser()
  const { data } = useSWR(
    user?.id ? `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/account` : null,
    fetcher
  )

  function getQuotaColorSchema(percentageUsed: number) {
    console.log(percentageUsed)
    if (percentageUsed > 100) {
      return 'red'
    } else if (percentageUsed > 70) {
      return 'orange'
    }
    return 'teal'
  }

  // TODO :: Show progress as circular in collapsed view

  if (data) {
    const percentageUsed = (data.payload.usedStorage / twoGbInMb) * 100
    const quotaColorSchema = getQuotaColorSchema(percentageUsed)
    return (
      <Flex direction='column'>
        <Progress
          w='100%'
          colorScheme={quotaColorSchema}
          rounded='md'
          h='5px'
          value={percentageUsed}
        />
        <Flex py='1' justify='space-between'>
          <Text fontSize='.6rem'>{`${data.payload.usedStorage} / 2000mb Used`}</Text>
        </Flex>
      </Flex>
    )
  }

  return null
}
