import 'video.js/dist/video-js.css'
import { useEffect, useRef } from 'react'
import videojs, { VideoJsPlayerOptions } from 'video.js'

export const VideoJS = (props: { options: VideoJsPlayerOptions; onReady: Function }) => {
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const { options, onReady } = props

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current
      if (!videoElement) return

      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log('player is ready')
        onReady && onReady(player)
      }))
    } else {
      // you can update player here [update player through props]
      // const player = playerRef.current;
      // player.autoplay(options.autoplay);
      // player.src(options.sources);
    }
  }, [options])

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
    <div style={{ width: '900px' }}>
      <video ref={videoRef} className='video-js vjs-bken vjs-big-play-centered' />
    </div>
  )
}

export default VideoJS
