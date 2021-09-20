import useSWR from 'swr'
import VideoCard from './VideoCard'
import { SimpleGrid } from '@chakra-ui/react'
import { getApiUrl } from '../../utils/api'
import { fetcher } from '../../utils/fetcher'

interface VideoGridProps {
  podId: string
}

export default function VideoGrid(props: VideoGridProps): JSX.Element {
  const { podId } = props
  const { data: videos } = useSWR(podId ? `${getApiUrl()}/pods/${podId}/videos` : null, fetcher)
  return (
    <SimpleGrid minChildWidth={[200, 350]} spacing='10px'>
      {videos?.data?.map(v => (
        <VideoCard key={v._id} podId={podId} v={v} />
      ))}
    </SimpleGrid>
  )
}
