import 'vidstack/styles/defaults.css'

import { Box } from '@chakra-ui/react'
import { MediaOutlet, MediaPlayer } from '@vidstack/react'
import { Asset } from '../../types/types'

const apiUrl =
  process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://pier.rustyguts.net'

export default function ListAsset({ asset }: { asset: Asset }) {
  const streamUrl = `${apiUrl}/${asset.streamPath}`

  return (
    <Box w="100%" h="1000px">
      <MediaPlayer autoplay controls src={streamUrl} aspectRatio={16 / 9}>
        <MediaOutlet />
      </MediaPlayer>
    </Box>
  )
}
