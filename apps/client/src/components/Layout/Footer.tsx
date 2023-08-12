import { Flex, Text } from '@chakra-ui/react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <Flex bg="gray.900" justify="center" align="center" w="100%" h="50px">
      <Text fontSize=".8rem">{`© ${currentYear}`}</Text>
    </Flex>
  )
}
