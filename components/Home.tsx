import Upload from './Upload/Upload'
import VideoGrid from './Videos/VideoGrid'
import cookies from 'js-cookie'
import io from 'socket.io-client'
import useSWR from 'swr'
import { fetcher } from '../utils/axios'
import { getAPIUrl } from '../utils/urls'
import { useEffect } from 'react'

let socket: any

export default function Home() {
  const { data } = useSWR(`${getAPIUrl()}/videos`, fetcher)

  useEffect(() => {
    socket = io(`${getAPIUrl()}`)
    const jwtToken = cookies.get('token')
    socket.emit('join', jwtToken)
    return () => {
      socket.close()
    }
  }, [])

  if (data?.payload.length && socket) {
    return (
      <>
        <Upload />
        <VideoGrid _videos={data?.payload} socket={socket} />
      </>
    )
  }

  return null
}
