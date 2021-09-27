import React from 'react'
import Layout from '../components/Layout'
import { Flex, Heading, Text } from '@chakra-ui/react'

export default function Index(): JSX.Element {
  return (
    <Layout>
      <Flex direction='column' align='center' pt='10'>
        <Heading> Ahoy! </Heading>
        <Text> bken.io is a collabrative video hosting site.</Text>
        <Text> We are still in alpha and adding new features all the time.</Text>
        <Text> Sign in and start sharing videos with friends! </Text>
      </Flex>
    </Layout>
  )
}
