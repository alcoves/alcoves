import logo from '../../assets/logo.png'
import { Flex, Heading } from '@chakra-ui/react'
import Profile from './Profile'

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
      <Flex direction="row" align="center">
        <img height={30} width={30} src={logo} alt="logo" />
        <Heading h="30px" pl="4" pt="1" size="md">
          Alcoves
        </Heading>
      </Flex>
      <Flex>
        <Profile />
      </Flex>
    </Flex>
  )
}
