import useSWR, { useSWRConfig } from 'swr'
import Layout from '../../../components/Layout'

import { getApiUrl } from '../../../utils/api'
import { fetcher, fetchMutate } from '../../../utils/fetcher'
import { Spinner, Flex, Input, Avatar, HStack } from '@chakra-ui/react'
import { DeletePod } from '../../../components/Pods/DeletePod'
import VideoGrid from '../../../components/VideoGrid/Index'
import { Upload } from '../../../components/Pods/Upload'
import { ChangeEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import ListMembers from '../../../components/Pods/ListMembers'

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
  const [name, setName] = useState(pod?.data?.name || '')
  const isOwner = pod?.data?.owner === session?.id

  useEffect(() => {
    if (name) {
      clearTimeout(timer)
      timer = setTimeout(async () => {
        await fetchMutate({
          method: 'patch',
          data: { name },
          url: `${getApiUrl()}/pods/${podId}`,
        })
        mutatePod()
        mutate(`${getApiUrl()}/pods`)
      }, 750)
    }
  }, [name])

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
            <ListMembers members={pod.data.members} />
            <Flex my='2'>
              <Input
                mr='2'
                w='100%'
                size='sm'
                rounded='md'
                variant='filled'
                value={pod.data.name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setName(event.target.value)
                }}
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
