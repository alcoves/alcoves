import Hls from 'hls.js'
import { Video } from '../types/types'
import { useEffect, useRef } from 'react'

export default function VideoFrame({
  v,
  muted = true,
  autoplay = true,
}: {
  v: Video
  muted: boolean
  autoplay: boolean
}) {
  const vRef = useRef(null)
  const manifestUrl = `https://s3.rustyguts.net/tidal/v/${v.id}/main.m3u8`
  const thumbnailUrl = `https://s3.rustyguts.net/tidal/v/${v.id}/thumbnail.avif`

  useEffect(() => {
    const video: HTMLMediaElement | any = vRef?.current

    if (video) {
      const hlsOpts = { autoStartLoad: false, debug: false }
      const hls = new Hls(hlsOpts)
      hls.loadSource(manifestUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        const _720pResolution = 1280 * 720
        let level720pIndex = 0

        for (let i = 0; i < hls.levels.length; i++) {
          const { width, height } = hls.levels[i]
          if (width * height >= _720pResolution) {
            level720pIndex = i
            break
          }
        }

        if (level720pIndex) {
          console.log('auto loading 720p resolution', level720pIndex)
          hls.loadLevel = level720pIndex
        }

        hls.startLoad()

        video.play().catch(() => {
          console.error('failed to autoplay. user must interact')
        })
      })
    }
  }, [])

  return (
    <video
      style={{
        borderRadius: '5px',
        maxHeight: '80vh',
      }}
      width='auto'
      ref={vRef}
      muted={muted}
      controls={true}
      autoPlay={autoplay}
      poster={thumbnailUrl}
    />
  )
}
