import Link from 'next/link'
import logo from '../../public/logo.png'
import { Avatar, Flex, Heading } from '@chakra-ui/react'
import Image from 'next/image'

function Profile() {
  return (
    <Link href="/login">
      <Avatar size="sm" name="Test User" />
    </Link>
  )
}

export default function TopBar() {
  return (
    <Flex
      bg="gray.900"
      w="100%"
      h="50px"
      justify="space-between"
      align="center"
      px="3"
      py="1"
    >
      <Flex as={Link} href="/" direction="row" align="center">
        <Image height={30} width={30} src={logo} alt="logo" />
        <Heading h="30px" pl="4" pt="1" size="md">
          Alcoves
        </Heading>
      </Flex>
      <Flex align="center">{/* <Profile /> */}</Flex>
    </Flex>
  )
}
