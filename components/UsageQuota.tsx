import useSWR from 'swr'
import useUser from '../hooks/useUser'
import { fetcher } from '../utils/axios'
import { Flex, Progress, Text } from '@chakra-ui/react'

const twoGb = 2147483648

function getReadableFileSizeString(fileSizeInBytes: number) {
  let i = -1
  const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB']
  do {
    fileSizeInBytes = fileSizeInBytes / 1024
    i++
  } while (fileSizeInBytes > 1024)

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i]
}

export default function UsageQuota() {
  const { user } = useUser()
  const { data } = useSWR(
    user?.id ? `http://localhost:4000/users/${user.id}/account` : null,
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
    const percentageUsed = (data.payload.usedStorage / twoGb) * 100
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
          <Text fontSize='.6rem'>
            {getReadableFileSizeString(data.payload.usedStorage)} / 2GB Used
          </Text>
        </Flex>
      </Flex>
    )
  }

  return null
}
