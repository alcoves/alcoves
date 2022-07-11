import { Box } from '@chakra-ui/react'
import Hls from 'hls.js'
import { useEffect, useRef } from 'react'

import { Video } from '../../types/types'
import { getHlsUrl } from '../../utils/urls'

export default function Player({ v }: { v: Video }) {
  const vRef = useRef(null)

  useEffect(() => {
    const video: HTMLMediaElement | any = vRef?.current
    if (video) {
      const hls = new Hls({ autoStartLoad: false })
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
        video.play()
      })
    }
  }, [])

  return (
    <Box
      h='auto'
      w='auto'
      maxW='100%'
      maxH='100%'
      rounded='md'
      overflow='hidden'
      boxShadow='#0000008a 0 0 40px'
    >
      <video
        style={{
          width: '100%',
          maxHeight: '100%',
          objectFit: 'cover',
        }}
        ref={vRef}
        controls={true}
        autoPlay={true}
        poster={v.thumbnailUrl}
      />
    </Box>
  )
}
