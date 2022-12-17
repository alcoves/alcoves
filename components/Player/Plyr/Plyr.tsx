// @ts-nocheck
'use client'

import 'plyr/dist/plyr.css'
import './plyr.css'
import Plyr from 'plyr'
import Hls from 'hls.js'
import { useEffect, useRef } from 'react'

export default function PlyrFrame({ options }) {
  const playerRef = useRef(null)

  useEffect(() => {
    // For more options see: https://github.com/sampotts/plyr/#options
    // captions.update is required for captions to work with hls.js
    const player = new Plyr(playerRef.current, {
      captions: { active: true, update: true, language: 'en' },
    })

    if (!Hls.isSupported()) {
      playerRef.current.src = options.source
    } else {
      // For more Hls.js options, see https://github.com/dailymotion/hls.js
      const hls = new Hls()
      hls.loadSource(options.source)
      hls.attachMedia(playerRef.current)
      window.hls = hls
    }
  }, [])

  return <video ref={playerRef} poster={options.poster} />
}
