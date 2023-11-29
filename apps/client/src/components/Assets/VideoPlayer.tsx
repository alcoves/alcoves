import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'

import { Asset } from '../../types'
import { getAssetUrl } from '../../lib/api'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default'

export default function VideoPlayer({ asset }: { asset: Asset }) {
  const url = getAssetUrl(asset)

  return (
    <MediaPlayer playsinline src={url} aspectRatio="16/9">
      <MediaProvider />
      <DefaultVideoLayout
        // thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  )
}
