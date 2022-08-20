import { Flex, SimpleGrid } from '@chakra-ui/react'

import { Video } from '../../types/types'
import VideoItem from '../Videos/VideoItem'

export default function PodMediaGrid({ videos }: { videos: Video[] }) {
  return (
    <Flex direction='column'>
      <SimpleGrid pt='1' minChildWidth={['100%', '400px']} spacing='4px'>
        {videos?.map((v: Video) => {
          return <VideoItem v={v} key={v.id} />
        })}
      </SimpleGrid>
    </Flex>
  )
}
