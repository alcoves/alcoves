import { SimpleGrid } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { Video } from '../../types/types'
import VideoItem from '../Videos/VideoItem'

export default function VideoGrid({ _videos, socket }: { _videos: Video[]; socket: any }) {
  const [videos, setVideos] = useState({})

  useEffect(() => {
    const obj: any = {}
    for (const video of _videos) {
      obj[video.id] = video
    }
    setVideos(obj)
  }, [_videos])

  useEffect(() => {
    const videoListener = (updatedVideo: Video) => {
      const updatedObject: any = {}
      updatedObject[updatedVideo.id] = updatedVideo
      setVideos(previous => {
        return {
          ...previous,
          ...updatedObject,
        }
      })
    }

    socket.on('update.video', videoListener)

    return () => {
      socket.off('update.video', videoListener)
    }
  }, [])

  return (
    <SimpleGrid pt='1' minChildWidth={['100%', '400px']} spacing='4px'>
      {Object.values(videos)?.map((v: any) => {
        return <VideoItem v={v} key={v.id} />
      })}
    </SimpleGrid>
  )
}
