// @ts-nocheck
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { useEffect, useRef } from 'react'

export default function VideoPlayer({ options }) {
  const container = useRef()
  const player = useRef()

  useEffect(() => {
    player.current = videojs(container.current, options)
    return () => {
      player.current.dispose()
    }
  }, [])

  return <video ref={container} className='video-js' />
}
