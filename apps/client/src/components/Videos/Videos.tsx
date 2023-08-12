import useSWR from 'swr'
import VideoItem from './VideoItem'

import { Video } from '../../types'
import { Heading } from '@chakra-ui/react'

export default function Videos() {
  const { data, error, isLoading } = useSWR('/videos')

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <div>
      <Heading size="md"> Videos </Heading>
      {data?.map((v: Video) => {
        return <VideoItem key={v.id} video={v} />
      })}
    </div>
  )
}
