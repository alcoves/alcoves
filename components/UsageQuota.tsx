import useSWR from 'swr'
import useUser from '../hooks/useUser'
import { fetcher } from '../utils/axios'
import { Box, Tooltip, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'

const twoGbInMb = 2000

export default function UsageQuota() {
  const { user } = useUser()
  const { data } = useSWR(
    user?.id ? `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/account` : null,
    fetcher
  )

  function getQuotaColorSchema(percentageUsed: number) {
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
    const quotaColorSchema = getQuotaColorSchema(percentageUsed)
    return (
      <Tooltip label={`${percentageUsed}% used`} aria-label='A tooltip' placement='right'>
        <Box w='50px' h='50px'>
          <CircularProgress size='50px' color={quotaColorSchema} value={percentageUsed}>
            <CircularProgressLabel>{Math.round(percentageUsed)}%</CircularProgressLabel>
          </CircularProgress>
        </Box>
      </Tooltip>
    )
  }

  return null
}
