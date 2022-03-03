import useSWR from 'swr'
import VideoItem from './Videos/VideoItem'
import { fetcher } from '../utils/axios'
import { getAPIUrl } from '../utils/urls'
import { SimpleGrid } from '@chakra-ui/react'

export default function Home() {
  const { data, error, loading } = useSWR(`${getAPIUrl()}/videos`, fetcher)

  return (
    <SimpleGrid pt='1' minChildWidth={['100%', '400px']} spacing='4px'>
      {data?.payload?.map((v: any) => {
        return <VideoItem v={v} key={v.id} />
      })}
    </SimpleGrid>
  )
}
