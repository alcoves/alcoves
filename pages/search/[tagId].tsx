import Layout from '../../components/Layout/Layout'

import { useRouter } from 'next/router'
import { Tag, Video } from '../../types/types'
import { Box, HStack, Heading } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getTag, getVideosByTagId } from '../../lib/api'
import ListVideos from '../../components/Videos/ListVideos'
import { formatDuration, megabytesToSize } from '../../lib/util'

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

  const totalSize = data?.videos.reduce((acc, cv) => {
    cv?.playbacks?.map((playback) => {
      acc += playback.size
    })

    return acc
  }, 0)

  const totalDuration = data?.videos.reduce((acc, cv) => {
    acc += cv?.playbacks?.[0]?.duration
    return acc
  }, 0)

  return (
    <Layout>
      <Box p="4" w="100%">
        <Heading>Tag: {tagData?.tag.name}</Heading>
        <HStack spacing="2">
          <Box>Total Size: {megabytesToSize(totalSize as number)}</Box>
          <Box>Total Duration: {formatDuration(totalDuration as number)}</Box>
        </HStack>
        <ListVideos videos={data?.videos} />
      </Box>
    </Layout>
  )
}
