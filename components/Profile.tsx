import { useRouter } from 'next/navigation'
import { useUser } from '../contexts/UserContext'
import { Box, Button, Heading, Text, useToast } from '@chakra-ui/react'

export default function Profile() {
  const toast = useToast()
  const router = useRouter()
  const { user, logout } = useUser()

  async function handleLogout(e) {
    e.preventDefault()

    try {
      await logout()
      router.push('/login')
    } catch (error) {
      toast({
        title: 'Logout Error',
        description: 'Encountered an error while logging out.',
        status: 'error',
        duration: 4000,
        isClosable: false,
      })
    }
  }

  if (user) {
    return (
      <Box>
        <Heading size='md'>{`Welcome, ${user.username}!`}</Heading>
        <Text>{`UserID: ${user.id}`}</Text>
        <Text>{`email: ${user.email}`}</Text>
        <Button size='sm' onClick={handleLogout}>
          Log Out
        </Button>
      </Box>
    )
  }

  return null
}
