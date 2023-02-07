import { Avatar, Flex } from '@chakra-ui/react'

function Profile() {
  const loggedIn = false

  if (!loggedIn) {
    return <Avatar size='sm' />
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
