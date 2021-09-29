import 'videojs-persist'
import 'video.js/dist/video-js.css'
import 'videojs-hls-quality-selector'
import 'videojs-contrib-quality-levels'
import videojs, { VideoJsPlayerOptions } from 'video.js'
import { useCallback, useEffect, useState } from 'react'

export default function VideoPlayer(props: VideoJsPlayerOptions): JSX.Element {
  const [videoEl, setVideoEl] = useState(null)
  const onVideo = useCallback(el => {
    setVideoEl(el)
  }, [])

  useEffect(() => {
    if (videoEl == null) return
    const player = videojs(videoEl, props)
    // eslint-disable-next-line
    // @ts-ignore
    player.hlsQualitySelector({
      displayCurrentQuality: true,
    })
    // eslint-disable-next-line
    // @ts-ignore
    player.persist()
    return () => {
      player.dispose()
    }
  }, [props, videoEl])

  return (
    <div data-vjs-player>
      <video ref={onVideo} className='vjs-bken video-js vjs-big-play-centered' playsInline />
    </div>
  )
}
