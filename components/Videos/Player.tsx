import Hls from 'hls.js'
import { useEffect, useRef } from 'react'

import { Video } from '../../types/types'
import { getHlsUrl, getThumanailUrl } from '../../utils/urls'

export default function Player({ v, style = {} }: { v: Video; style?: any }) {
  const vRef = useRef(null)
  const thumbnailUrl = `${getThumanailUrl(v?.cdnUrl)}`

  useEffect(() => {
    const video: HTMLMediaElement | any = vRef?.current
    if (video) {
      const hls = new Hls()
      hls.loadSource(`${getHlsUrl(v?.cdnUrl)}`)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play()
      })
    }
  }, [])

  return <video ref={vRef} style={style} controls={true} autoPlay={false} poster={thumbnailUrl} />
}
