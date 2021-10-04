import useSWR, { useSWRConfig } from 'swr'
import Layout from '../../../components/Layout'

import { getApiUrl } from '../../../utils/api'
import { fetcher, fetchMutate } from '../../../utils/fetcher'
import { Spinner, Flex, Input, Avatar, HStack } from '@chakra-ui/react'
import { DeletePod } from '../../../components/Pods/DeletePod'
import VideoGrid from '../../../components/VideoGrid/Index'
import { Upload } from '../../../components/Pods/Upload'
import { ChangeEvent } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

let timer: NodeJS.Timeout

export default function PodView(): JSX.Element {
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const { podId } = router.query
  const { data: session } = useSession()
  const { data: pod, mutate: mutatePod } = useSWR(
    podId ? `${getApiUrl()}/pods/${podId}` : null,
    fetcher
  )
  const { data: videos } = useSWR(podId ? `${getApiUrl()}/pods/${podId}/videos` : null, fetcher, {
    refreshInterval: 10000,
  })

  const isOwner = pod?.data?.owner === session?.id

  function handlePodNameChange(e: ChangeEvent<HTMLInputElement>) {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      await fetchMutate({
        method: 'patch',
        data: { name: e.target.value },
        url: `${getApiUrl()}/pods/${podId}`,
      })
      mutatePod()
      mutate(`${getApiUrl()}/pods`)
    }, 750)
  }

  if (!pod?.data || !videos?.data) {
    return (
      <Layout>
        <Flex p='40px' justify='center'>
          <Spinner />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout>
      <Flex direction='column' p='4'>
        <Flex w='100%' justify='center'>
          <Flex direction='column' align='center' pb='4' maxW='300px'>
            <Avatar name={pod.data.name} size='xl' mb='4' />
            <Flex my='2'>
              <Input
                mr='2'
                w='100%'
                size='sm'
                rounded='md'
                variant='filled'
                defaultValue={pod.data.name}
                onChange={handlePodNameChange}
              />
              {isOwner && <DeletePod id={pod.data._id} />}
            </Flex>
            <Upload podId={pod.data._id} />
            <HStack align='end' py='2'></HStack>
          </Flex>
        </Flex>
        <VideoGrid videos={videos.data} />
      </Flex>
    </Layout>
  )
}
