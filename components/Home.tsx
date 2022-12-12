import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'

export default function Home() {
  return (
    <Flex direction='column' pt='10'>
      <Heading>Drag file here or</Heading>
      <Heading>click anywhere to upload</Heading>
    </Flex>
  )
}
