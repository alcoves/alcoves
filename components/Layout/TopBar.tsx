import Link from 'next/link'
import { Avatar, Flex } from '@chakra-ui/react'
import { useUser } from '../../Contexts/UserContext'

function Profile() {
  const { user } = useUser()

  if (user.isAuthenticated) {
    return (
      <Link href='/profile'>
        <Avatar mr='2px' mt='2px' name={user.username} size='sm' />
      </Link>
    )
  }

  return (
    <Link href='/login'>
      <Avatar size='sm' name='Test User' />
    </Link>
  )
}

export default function TopBar() {
  return (
    <Flex w='100%' h='40px' justify='end' align='center' p='1'>
      <Profile />
    </Flex>
  )
}
