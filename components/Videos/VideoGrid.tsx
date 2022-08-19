import { Button, Flex, SimpleGrid } from '@chakra-ui/react'
import cookies from 'js-cookie'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

import { useVideos } from '../../stores/videos'
import { Video } from '../../types/types'
import { getAPIUrl } from '../../utils/urls'
import VideoItem from '../Videos/VideoItem'

let socket: any

export default function VideoGrid() {
  const { videos, add, start, remove, update, loadMore } = useVideos()

  useEffect(() => {
    start()

    socket = io(`${getAPIUrl()}`, {
      transports: ['websocket'],
    })
    const jwtToken = cookies.get('token')
    socket.emit('join', jwtToken)

    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    socket.on('videos.add', add)
    socket.on('videos.remove', remove)
    socket.on('videos.update', update)

    return () => {
      socket.off('videos.add', add)
      socket.off('videos.remove', remove)
      socket.off('videos.update', update)
    }
  }, [add, remove, update])

  return (
    <Flex direction='column'>
      <SimpleGrid pt='1' minChildWidth={['100%', '400px']} spacing='4px'>
        {videos.map((v: Video) => {
          return <VideoItem v={v} key={v.id} />
        })}
      </SimpleGrid>
      <Button w='300px' alignSelf='center' onClick={loadMore} isDisabled={!videos.length}>
        Load More
      </Button>
    </Flex>
  )
}
