import Layout from '../../components/Layout/Layout'

import { useRouter } from 'next/router'
import { Tag, Video } from '../../types/types'
import { Box, Heading } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getTag, getVideosByTagId } from '../../lib/api'
import ListVideos from '../../components/Videos/ListVideos'

export default function SearchByTagIdPage() {
  const router = useRouter()
  const { tagId } = router.query

  const { data: tagData } = useQuery({
    enabled: router.isReady,
    queryKey: [tagId],
    queryFn: async (): Promise<{ tag: Tag }> => {
      const data = await getTag(tagId as string)
      return data
    },
  })

  const { isLoading, isError, data, error } = useQuery({
    enabled: router.isReady,
    queryKey: ['videos', tagId],
    queryFn: async (): Promise<{ videos: Video[] }> => {
      const data = await getVideosByTagId(tagId as string)
      return data
    },
  })

  return (
    <Layout>
      <Box p="4" w="100%">
        <Heading>Tag: {tagData?.tag.name}</Heading>
        <ListVideos videos={data?.videos} />
      </Box>
    </Layout>
  )
}
