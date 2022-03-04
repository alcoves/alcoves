import useSWR from 'swr'
import cookies from 'js-cookie'
import io from 'socket.io-client'
import VideoItem from './Videos/VideoItem'
import { fetcher } from '../utils/axios'
import { getAPIUrl } from '../utils/urls'
import { useEffect } from 'react'
import { SimpleGrid } from '@chakra-ui/react'

let socket: any

export default function Home() {
  const { data, mutate } = useSWR(`${getAPIUrl()}/videos`, fetcher)

  useEffect(() => {
    socket = io(`${getAPIUrl()}`)
    const jwtToken = cookies.get('token')
    socket.emit('join', jwtToken)

    const videoListener = () => {
      console.log('Video update recieved')
      mutate()
    }

    socket.on('update.videos', videoListener)

    return () => {
      socket.close()
      socket.off('update.videos', videoListener)
    }
  }, [])

  console.log('is this slow', data?.payload[0].progress)

  return (
    <SimpleGrid pt='1' minChildWidth={['100%', '400px']} spacing='4px'>
      {data?.payload?.map((v: any) => {
        return <VideoItem v={v} key={v.id} />
      })}
    </SimpleGrid>
  )
}
