import { Flex, Heading } from '@chakra-ui/react'

export default function Home() {
  return (
    <Flex w='100%'>
      <Flex direction='column' justify='center'>
        <Heading size='sm' p='2'>
          This page displays the most subscribed public pods
        </Heading>
      </Flex>
    </Flex>
  )
}
