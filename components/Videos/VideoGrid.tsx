import { Button, Flex, SimpleGrid } from '@chakra-ui/react'
import axios from 'axios'
import cookies from 'js-cookie'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

import { useVideos } from '../../stores/videos'
import { Video } from '../../types/types'
import { getAPIUrl } from '../../utils/urls'
import VideoItem from '../Videos/VideoItem'

let socket: any

export default function VideoGrid() {
  const { videos, add, set, remove, update, loadMore } = useVideos()

  useEffect(() => {
    socket = io(`${getAPIUrl()}`)
    const jwtToken = cookies.get('token')
    socket.emit('join', jwtToken)

    axios.get(`${getAPIUrl()}/videos?limit=20`).then(({ data }) => {
      set(data.payload)
    })

    return () => {
      socket.close()
    }
  }, [set])

  async function handleLoadMore() {
    if (videos.length) {
      const lastVideo = videos[videos.length - 1]
      const cursorQuery = `${lastVideo.id}_${lastVideo.createdAt}`
      const fetchURL = `${getAPIUrl()}/videos?limit=20&after=${cursorQuery}`
      const { data } = await axios.get(fetchURL)

      loadMore(data?.payload)
    }
  }

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
      <Button isDisabled={!videos.length} onClick={handleLoadMore} w='300px' alignSelf='center'>
        Load More
      </Button>
    </Flex>
  )
}
