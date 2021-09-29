// eslint-disable-next-line
// @ts-nocheck

import 'videojs-persist'
import 'video.js/dist/video-js.css'
import 'videojs-hls-quality-selector'
import 'videojs-contrib-quality-levels'
import { useEffect, useRef } from 'react'
import videojs, { VideoJsPlayerOptions } from 'video.js'

export default function VideoPlayer(props: VideoJsPlayerOptions): JSX.Element {
  const videoRef = useRef(null)
  const playerRef = useRef(null)

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current
      if (!videoElement) return
      const player = (playerRef.current = videojs(videoElement, props, () => {
        player.hlsQualitySelector({
          displayCurrentQuality: true,
        })
      }))
    }
  }, [props])

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [])

  return (
    <div data-vjs-player>
      <video ref={videoRef} className='vjs-bken video-js vjs-big-play-centered' />
    </div>
  )
}
