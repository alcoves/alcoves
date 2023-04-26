import VidstackPlayer from '../Players/Vidstack/Player'

import { useRouter } from 'next/router'
import { Video } from '../../types/types'
import { Box, Code, Flex, Heading } from '@chakra-ui/react'

const apiUrl =
  process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://pier.rustyguts.net'

export default function ListVideo({ video }: { video: Video }) {
  const router = useRouter()
  const streamUrl = `${apiUrl}/videos/${video.id}`

  return (
    <Flex w="100%" h="100%" direction="column">
      <VidstackPlayer options={{ source: streamUrl }} />
      <Box px="12" pt="4">
        <Heading size="lg">{video.title}</Heading>
        <Box mt="2">
          <Code w="100%">Direct Link: {streamUrl}</Code>
          <Code w="100%">Share Link: {router.asPath}</Code>
          {/* <Button size="sm">Clip</Button> */}
        </Box>
      </Box>
    </Flex>
  )
}
