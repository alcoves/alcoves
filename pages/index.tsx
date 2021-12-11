import React, { useContext } from 'react'
import Layout from '../components/Layout'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { UserContext } from '../contexts/user'
import { useRouter } from 'next/router'

export default function Index() {
  const router = useRouter()
  const { loading, authenticated } = useContext(UserContext)

  if (!loading && !authenticated) {
    // TODO :: Splash page here
    router.push('/login')
    return null
  }

  return <Layout>This should be the My Bken component</Layout>
}
