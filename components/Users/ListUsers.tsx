import { Box, Skeleton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { listUsers } from '../../lib/api'
import UserRow from './UserRow'
import { User } from '../../types/types'

export default function ListUsers() {
  const { isLoading, isError, data, error } = useQuery({
    queryFn: listUsers,
    queryKey: ['list_users'],
  })

  if (isLoading) {
    return <Skeleton height='20px' />
  }

  if (data) {
    return (
      <Box w='100%'>
        {data?.users?.map((u: User) => (
          <UserRow key={u.id} user={u} />
        ))}
      </Box>
    )
  }

  return null
}
