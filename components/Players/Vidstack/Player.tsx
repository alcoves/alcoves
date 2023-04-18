import 'vidstack/styles/defaults.css'

import React from 'react'
import { MediaPlayer, MediaOutlet } from '@vidstack/react'

interface VideoProps {
  options: {
    source: string
  }
}

const VidstackPlayer: React.FC<VideoProps> = ({ options }) => {
  return (
    <MediaPlayer
      controls
      autoplay
      aspectRatio={16 / 9}
      src={options.source}
      // poster={options.poster}
    >
      <MediaOutlet />
    </MediaPlayer>
  )
}

export default VidstackPlayer
