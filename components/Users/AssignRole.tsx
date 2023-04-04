import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { Role, User } from '../../types/types'
import { Flex, Switch, Text } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { patchUser } from '../../lib/api'

export default function AssignRole({ user }: { user: User }) {
  const toast = useToast()
  const [isAdmin, setIsAdmin] = useState<boolean>(Boolean(user.role === Role.ADMIN))

  const { mutate, isLoading, isError, isSuccess } = useMutation({
    mutationFn: patchUser,
  })

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'User updated',
        description: `${user.username} is now ${isAdmin ? 'an admin' : 'a user'}`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    }
  }, [isAdmin, user, toast, isSuccess])

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Failed to update user role.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }, [toast, isError])

  return (
    <Flex mr='4'>
      <Text pr='1'>{`Admin: ${isAdmin}`}</Text>
      <Switch
        size='md'
        isDisabled={isLoading}
        defaultChecked={isAdmin}
        onChange={({ target }) => {
          setIsAdmin(target.checked)
          mutate({ userId: user.id, data: { role: isAdmin ? Role.USER : Role.ADMIN } })
        }}
      />
    </Flex>
  )
}
