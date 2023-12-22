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
  const { getHLSManifestUrl } = useConfig()
  const manifestUrl = getHLSManifestUrl(asset.id)

  return (
    <MediaPlayer playsinline src={manifestUrl} aspectRatio="16/9">
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  )
}
