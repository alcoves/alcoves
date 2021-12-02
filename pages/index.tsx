import React from 'react'
import Layout from '../components/Layout'
import { Flex, Heading, Text } from '@chakra-ui/react'

export default function Index(): JSX.Element {
  return (
    <Layout>
      <Flex direction='column' align='center' pt='10'>
        <Heading> Ahoy! </Heading>
        <Text> We're working on something big </Text>
        <Text> If you participated in our alpha, thank you! More details to come</Text>
      </Flex>
    </Layout>
  )
}
