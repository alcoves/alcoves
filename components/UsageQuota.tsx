import useSWR from 'swr'
import useUser from '../hooks/useUser'
import { fetcher } from '../utils/axios'
import { Box, Text, Heading, Progress } from '@chakra-ui/react'

const twoGbInMb = 2000

export default function UsageQuota() {
  const { user } = useUser()
  const { data } = useSWR(
    user?.id ? `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/account` : null,
    fetcher
  )

  function getquotaColorScheme(percentageUsed: number) {
    if (percentageUsed >= 100) {
      return 'red'
    } else if (percentageUsed > 70) {
      return 'orange'
    }
    return 'teal'
  }

  if (data) {
    let percentageUsed = (data.payload.usedStorage / twoGbInMb) * 100
    if (percentageUsed > 100) percentageUsed = 100
    const quotaColorScheme = getquotaColorScheme(percentageUsed)
    return (
      <Box w='100%'>
        <Heading size='sm'>Quota</Heading>
        <Text fontSize='.8rem'>{`${percentageUsed}% of quota used`}</Text>
        <Progress my='1' h='1' rounded='md' value={percentageUsed} colorScheme={quotaColorScheme} />
      </Box>
    )
  }

  return null
}
