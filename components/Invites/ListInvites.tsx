import InviteItem from './InviteItem'

import { listInvites } from '../../lib/api'
import { useQuery } from '@tanstack/react-query'
import { Box, Skeleton, Spinner, Stack, Text } from '@chakra-ui/react'

export default function ListInvites() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['invites'],
    queryFn: listInvites,
  })

  if (isError) {
    // TODO :: Toast notification
    return null
  }

  if (isLoading) {
    return (
      <Box>
        <Stack>
          <Skeleton height='20px' />
          <Skeleton height='20px' />
          <Skeleton height='20px' />
        </Stack>
      </Box>
    )
  }

  console.log(data)

  return (
    <Box>
      <InviteItem />
    </Box>
  )
}
