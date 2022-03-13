import { Box } from '@chakra-ui/react'
import Hls from 'hls.js'
import { useEffect, useRef } from 'react'

import { Video } from '../../types/types'
import { getHlsUrl, getThumanailUrl } from '../../utils/urls'

export default function Player({ v }: { v: Video }) {
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
        poster={thumbnailUrl}
      />
    </Box>
  )
}
