import VidstackPlayer from '../Players/Vidstack/Player'

import { useRouter } from 'next/router'
import { Video } from '../../types/types'
import { useQuery } from '@tanstack/react-query'
import { apiUrl, getVideo } from '../../lib/api'
import { Box, Code, Flex, Heading } from '@chakra-ui/react'

export default function ListVideo({
  id,
}: {
  id: string | string[] | undefined
}) {
  const router = useRouter()

  const { isLoading, isError, data, error } = useQuery({
    enabled: Boolean(id),
    queryKey: ['videos', id],
    queryFn: async (): Promise<{ video: Video }> => {
      const data = await getVideo(id as string)
      return data
    },
  })

  const streamUrl = `${apiUrl}/videos/${id}/stream`
  // const shareUrl = `${window.location.origin}${router.asPath}`

  if (!data?.video) return null

  return (
    <Flex w="100%" h="100%" direction="column">
      <VidstackPlayer options={{ source: streamUrl }} />
      <Box px="12" pt="4">
        <Heading size="lg">{data?.video.title}</Heading>
        <Box mt="2">
          <Code w="100%">Stream Link: {streamUrl}</Code>
          {/* <Code w="100%">Alcove Share Link: {shareUrl}</Code> */}
          {/* <Button size="sm">Clip</Button> */}
        </Box>
      </Box>
    </Flex>
  )
}
