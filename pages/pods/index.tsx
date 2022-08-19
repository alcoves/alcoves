import { Box, Heading, Spacer, Text } from '@chakra-ui/react'
import useSWR from 'swr'

import Landing from '../../components/Landing'
import Layout from '../../components/Layout'
import CreatePod from '../../components/Pods/CreatePod'
import PodList from '../../components/Pods/PodList'
import { userStore } from '../../stores/user'
import { fetcher } from '../../utils/axios'
import { getAPIUrl } from '../../utils/urls'

export default function Index() {
  const { user, loading } = userStore()
  const { data } = useSWR(`${getAPIUrl()}/pods`, fetcher)

  if (loading) return null
  if (!user) return <Landing />

  return (
    <Layout>
      <Box p='2'>
        <Heading pt='2'>Pods</Heading>
        <Text>Easily share content by creating a pod</Text>
        <CreatePod />
        <Spacer h='10px' />
        <PodList pods={data?.pods} />
      </Box>
    </Layout>
  )
}
