import { Button, Flex, SimpleGrid } from '@chakra-ui/react'

import { Video } from '../../types/types'
import VideoItemSelect from '../Videos/VideoItemSelect'

export default function VideoGridSelect({
  videos,
  loadMore,
  toggleSelected,
}: {
  videos: Video[]
  loadMore: () => void
  toggleSelected: (id: string) => void
}) {
  return (
    <Flex direction='column'>
      <SimpleGrid pt='1' minChildWidth={['100%', '400px']} spacing='4px'>
        {videos.map((v: Video) => {
          return <VideoItemSelect v={v} key={v.id} toggleSelected={toggleSelected} />
        })}
      </SimpleGrid>
      <Button mt='2' w='300px' alignSelf='center' onClick={loadMore} isDisabled={!videos.length}>
        Load More
      </Button>
    </Flex>
  )
}
