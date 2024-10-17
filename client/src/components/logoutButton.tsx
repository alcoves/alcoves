import { Button } from '@chakra-ui/react'
import { useAuth } from '../hooks/useAuth'

export default function LogoutButton() {
  const { logout } = useAuth()

  async function handleLogout() {
    await logout()
  }

  return (
    <Button colorScheme="red" onClick={handleLogout}>
      Logout
    </Button>
  )
}
