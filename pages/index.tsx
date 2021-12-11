import React from 'react'
import Layout from '../components/Layout'
import { Flex, Heading, Text } from '@chakra-ui/react'

export default function Index() {
  const loggedIn = true

  if (loggedIn) {
    return <Layout>This should be the My Bken component</Layout>
  }

  return (
    <Flex h='100vh' w='100vw' justify='center'>
      <Flex direction='column' align='center' pt='10'>
        <Heading> Ahoy! </Heading>
        <Text> {"We're working on something big"} </Text>
        <Text> If you participated in our alpha, thank you! More details to come</Text>
      </Flex>
    </Flex>
  )
}
