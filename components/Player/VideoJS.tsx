// @ts-nocheck
'use client'

import 'video.js/dist/video-js.css'
import './video-js-custom.css'

import videojs from 'video.js'
import { useEffect, useRef } from 'react'

export default function VideoJS({ options }) {
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
