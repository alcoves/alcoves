'use client'

import { useEffect, useState } from 'react'
import { Hls, Media } from '@vidstack/player-react'
import { getDimensions } from '../../../lib/metadata'

export default function VidstackPlayer({
  options,
}: {
  options: { poster: string; source: string; metadata: any }
}) {
  const dimensions = getDimensions(options.metadata)
  const [maxWidth, setMaxWidth] = useState(0)
  const [visibility, setVisibility] = useState('hidden' as DocumentVisibilityState)

  useEffect(() => {
    function handleResize() {
      let height
      const w = dimensions.width
      const h = dimensions.height
      const minH = 200
      const padding = 100

      if (h > window.innerHeight - padding) {
        height = window.innerHeight - padding
        const minHeight = h < minH ? h : minH
        if (height < minHeight) {
          height = minHeight
        }
      } else {
        height = h
      }

      setMaxWidth((w / h) * height)
      setVisibility('visible')
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ maxWidth, visibility }}>
      <Media>
        <Hls
          autoplay
          controls
          loading='eager'
          poster={options.poster}
          hlsLibrary={() => import('hls.js')}
        >
          <video controls preload='none' src={options.source}></video>
        </Hls>
      </Media>
    </div>
  )
}
