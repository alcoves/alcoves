import useSWR from 'swr'
import Layout from '../../../components/Layout'

import { getApiUrl } from '../../../utils/api'
import { fetcher } from '../../../utils/fetcher'
import { Spinner, Flex, Heading, HStack, Avatar } from '@chakra-ui/react'
import { DeletePod } from '../../../components/Pods/DeletePod'
import VideoGrid from '../../../components/VideoGrid/index'
import { Upload } from '../../../components/Pods/Upload'
import { Pod, Video } from '../../../types'
import { GetServerSidePropsContext } from 'next'

interface Props {
  pod: Pod
  videos: Video[]
  podFetchUrl: string
  videoFetchUrl: string
  videoRefreshInterval: number
}

export default function PodView(props: Props): JSX.Element {
  const { data: pod } = useSWR(props.podFetchUrl, fetcher, {
    fallbackData: props.pod,
  })
  const { data: videos } = useSWR(props.videoFetchUrl, fetcher, {
    fallbackData: props.videos,
    refreshInterval: props.videoRefreshInterval,
  })

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
        <VideoGrid videos={videos.data} />
      </Flex>
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // eslint-disable-next-line
  // @ts-ignore
  const { podId } = context?.params
  const podFetchUrl = `${getApiUrl()}/pods/${podId}`
  const videoFetchUrl = `${podFetchUrl}/videos`
  const pod = await fetcher(podFetchUrl, context)
  const videos = await fetcher(videoFetchUrl, context)

  const videoRefreshInterval = videos?.data?.reduce((acc: number, cv: { status: string }) => {
    if (cv.status !== 'completed') acc = 2000
    return acc
  }, null)

  console.log(videoRefreshInterval)

  return {
    props: {
      pod,
      videos,
      podFetchUrl,
      videoFetchUrl,
      // videoRefreshInterval,
    },
  }
}
