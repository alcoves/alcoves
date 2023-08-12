import useSWR from 'swr'
import VideoItem from './VideoItem'

import { Video } from '../../types'
import { Box } from '@chakra-ui/react'

export default function Videos() {
  const { data, error, isLoading } = useSWR('/videos')

  if (error) return <Box>failed to load</Box>
  if (isLoading) return <Box>loading...</Box>

  return (
    <Box>
      {data?.map((v: Video) => {
        return <VideoItem key={v.id} video={v} />
      })}
    </Box>
  )
}
