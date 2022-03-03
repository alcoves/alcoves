import useSWR from 'swr'
import VideoItem from '../Videos/VideoItem'
import { fetcher } from '../../utils/axios'
import { getAPIUrl } from '../../utils/urls'
import { Box, SimpleGrid } from '@chakra-ui/react'

export default function PodMediaGrid({ podId }: { podId: string }) {
  const { data } = useSWR(`${getAPIUrl()}/pods/${podId}/videos`, fetcher)

  if (data && !data?.payload?.length) {
    return <Box>Upload some content to get started!</Box>
  }

  return (
    <SimpleGrid pt='1' minChildWidth={['100%', '400px']} spacing='4px'>
      {data?.payload?.map((v: any) => {
        return <VideoItem v={v} key={v.id} />
      })}
    </SimpleGrid>
  )
}
