import VideoPlayer from '../VideoPlayer'
import { Video } from '../../types'
import { getTidalUrl } from '../../utils/api'
import { Box, Modal, ModalOverlay, ModalContent, ModalCloseButton } from '@chakra-ui/react'

export default function WatchModal(props: {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  v: Video
}): JSX.Element {
  const { isOpen, onClose, v } = props

  const hlsUrl = `${getTidalUrl()}/assets/${v.tidal}.m3u8`
  const thumbnailUrl = `https://cdn.bken.io/v/${v.tidal}/thumbnail.jpg`

  const videoJsOptions = {
    fluid: true,
    liveui: true,
    autoplay: true,
    controls: true,
    responsive: true,
    liveTracker: true,
    poster: thumbnailUrl,
    sources: [{ src: hlsUrl }],
  }

  return (
    <Modal autoFocus={false} isCentered closeOnEsc isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW='1280px'>
        <Box zIndex={1000}>
          <ModalCloseButton bg='rgba(0,0,0,.3)' />
        </Box>
        <VideoPlayer {...videoJsOptions} />
      </ModalContent>
    </Modal>
  )
}
