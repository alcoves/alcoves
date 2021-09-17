import React from 'react'
import Layout from '../components/Layout'
import { Flex, Heading, Text } from '@chakra-ui/react'

export default function Index(): JSX.Element {
  return (
    <Layout>
      <Flex direction='column' align='center' pt='10'>
        <Heading> Ahoy! </Heading>
        <Text> bken.io is a video sharing website for groups (pods) of people (dolphins)</Text>
        <Text> Create a pod and start sharing videos with friends! </Text>
      </Flex>
    </Layout>
  )
}
