import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'

import { Asset } from '../../types'
import { useConfig } from '../../contexts/ConfigContext'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default'

export default function VideoPlayer({ asset }: { asset: Asset }) {
  const { getThumbnailUrlBase, getDirectAssetUrlBase } = useConfig()

  const videoUrl = getDirectAssetUrlBase(asset.id)
  const thumbnailUrl = `${getThumbnailUrlBase(asset.id)}.jpg?q=80&w=1280`

  return (
    <MediaPlayer playsinline src={videoUrl} aspectRatio="16/9">
      <MediaProvider />
      <DefaultVideoLayout
        thumbnails={thumbnailUrl}
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  )
}
