import useSWR from 'swr'
import Layout from '../../../components/Layout'

import { useRouter } from 'next/router'
import { getApiUrl } from '../../../utils/api'
import { fetcher } from '../../../utils/fetcher'
import { Spinner, Flex, Heading, HStack, Avatar } from '@chakra-ui/react'
import { DeletePod } from '../../../components/Pods/DeletePod'
import VideoGrid from '../../../components/VideoGrid/index'
import { Upload } from '../../../components/Pods/Upload'

export default function Pod(): JSX.Element {
  const router = useRouter()
  const { podId } = router.query
  const { data: pod } = useSWR(podId ? `${getApiUrl()}/pods/${podId}` : null, fetcher)

  if (!pod?.data) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  return (
    <Layout>
      <Flex direction='column' p='4'>
        <Flex direction='column'>
          <Flex direction='column' align='center' pb='4'>
            <Avatar name={pod.data.name} size='xl' mb='4' />
            <Heading>{pod.data.name}</Heading>
            <Upload podId={pod.data._id} />
            <HStack py='2'>
              <DeletePod id={pod.data._id} />
            </HStack>
          </Flex>
        </Flex>
        <VideoGrid podId={pod.data._id} />
      </Flex>
    </Layout>
  )
}
