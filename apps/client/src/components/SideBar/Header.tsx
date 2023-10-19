import logo from '../../assets/logo.png'
import { Flex, Heading } from '@chakra-ui/react'

export default function Header() {
  return (
    <Flex p="2" w="100%" h="auto" align="center" justify="space-between">
      <Flex direction="row" align="center" w="100%">
        <img height={30} width={30} src={logo} alt="logo" />
        <Heading w="100%" pl="4" pt="1" size="md">
          Alcoves
        </Heading>
      </Flex>
    </Flex>
  )
}
