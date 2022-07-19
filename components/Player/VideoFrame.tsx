import Hls from 'hls.js'
import { useEffect, useRef } from 'react'

import { Video } from '../../types/types'
import { getHlsUrl } from '../../utils/urls'

export default function VideoFrame({ v }: { v: Video }) {
  const vRef = useRef(null)

  useEffect(() => {
    const video: HTMLMediaElement | any = vRef?.current
    if (video) {
      const hlsOpts = { autoStartLoad: false, debug: false }
      const hls = new Hls(hlsOpts)
      hls.loadSource(`${getHlsUrl(v?.cdnUrl)}`)
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
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
      }}
      ref={vRef}
      muted
      controls={true}
      autoPlay={true}
      poster={v.thumbnailUrl}
    />
  )
}
