import useSWR from 'swr'
import Layout from '../../components/Layout'

import { useRouter } from 'next/router'
import { getApiUrl } from '../../utils/api'
import { fetcher } from '../../utils/fetcher'
import { Spinner, Flex, Heading, HStack, Text } from '@chakra-ui/react'
import { DeletePod } from '../../components/Pods/DeletePod'

export default function Pod(): JSX.Element {
  const router = useRouter()
  const { id } = router.query
  const { data: pod } = useSWR(id ? `${getApiUrl()}/pods/${id}` : null, fetcher)

  if (!pod?.data) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  return (
    <Layout>
      <Flex direction='column'>
        <Flex direction='column'>
          <Heading>{pod.data.name}</Heading>
          <Text>{pod.data._id}</Text>
          <HStack>
            <DeletePod id={pod.data._id} />
          </HStack>
        </Flex>
        Here is the video grid component
      </Flex>
    </Layout>
  )
}
