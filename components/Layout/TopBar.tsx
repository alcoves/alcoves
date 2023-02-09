import { Avatar, Flex } from '@chakra-ui/react'
import { useUser } from '../../Contexts/UserContext'

function Profile() {
  const { user } = useUser()

  if (user.isAuthenticated) {
    return <Avatar name={user.username} size='sm' />
  }

  return <Avatar size='sm' name='Test User' src='' />
}

export default function TopBar() {
  return (
    <Flex w='100%' h='40px' justify='end' align='center' p='1'>
      <Profile />
    </Flex>
  )
}
