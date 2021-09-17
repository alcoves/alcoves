import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { Box, Button, Flex, SimpleGrid } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import StudioVideoCard from '../components/Studio/StudioVideoCard'
import { fetcher } from '../utils/fetcher'
import { Video } from '../types'

export default function Studio() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [videos, setVideos] = useState<Video[] | null>(null)

  const { data, mutate, isValidating } = useSWR(
    session ? `/api/users/${session.id}/videos` : null,
    fetcher
  )

  useEffect(() => {
    if (data?.length) {
      setVideos(data)
    }
  }, [data])

  if (status) return null
  if (!status && !session) {
    router.push('/login')
    return null
  }

  return (
    <Layout>
      <Box p='4'>
        <Flex mb='2' justify='end'>
          <Button isLoading={isValidating} size='sm' onClick={mutate}>
            Refresh
          </Button>
        </Flex>
        <SimpleGrid minChildWidth={[200, 400]} spacing='10px'>
          {videos?.map((v, i) => (
            <StudioVideoCard key={v._id || i} v={v} refetchVideoList={mutate} />
          ))}
        </SimpleGrid>
      </Box>
    </Layout>
  )
}
