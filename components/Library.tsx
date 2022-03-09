import cookies from 'js-cookie'
import { useEffect } from 'react'
import io from 'socket.io-client'
import useSWR from 'swr'

import { fetcher } from '../utils/axios'
import { getAPIUrl } from '../utils/urls'

import Upload from './Upload/UploadButton'
import VideoGrid from './Videos/VideoGrid'

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

  if (socket) {
    return (
      <>
        <Upload />
        {data?.payload.length ? <VideoGrid _videos={data?.payload} socket={socket} /> : null}
      </>
    )
  }

  return null
}
