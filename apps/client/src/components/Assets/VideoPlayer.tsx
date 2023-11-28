import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'

import { Asset } from '../../types'
import { getAssetUrl } from '../../lib/url'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default'

// ;<Box w="100%" h="100%">
//   <AspectRatio ratio={16 / 9}>
//     <video
//       muted
//       autoPlay
//       controls
//       src={asset.url}
//       style={{ maxWidth: '100%' }}
//     />
//   </AspectRatio>
// </Box>

export default function VideoPlayer({ asset }: { asset: Asset }) {
  const url = getAssetUrl(asset)

  return (
    <MediaPlayer playsinline src={url}>
      <MediaProvider />
      <DefaultVideoLayout
        // thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  )
}
