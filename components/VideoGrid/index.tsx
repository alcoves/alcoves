import VideoCard from './VideoCard'
import { Video } from '../../types'
import { SimpleGrid } from '@chakra-ui/react'

export default function VideoGrid(props: { videos: Video[] }): JSX.Element {
  return (
    <SimpleGrid minChildWidth={[200, 350]} spacing='10px'>
      {props?.videos?.map((v: Video) => (
        <VideoCard key={v._id} v={v} />
      ))}
    </SimpleGrid>
  )
}
