import VideoPlayer from '../VideoPlayer'
import { Video } from '../../types'
import { getTidalUrl } from '../../utils/api'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton } from '@chakra-ui/react'

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
    autoplay: true,
    controls: true,
    responsive: true,
    poster: thumbnailUrl,
    sources: [
      {
        src: hlsUrl,
        type: 'application/x-mpegURL',
      },
    ],
  }

  return (
    <Modal isCentered closeOnEsc isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW='1280px'>
        <ModalHeader>{v.title}</ModalHeader>
        <ModalCloseButton />
        <VideoPlayer {...videoJsOptions} />
      </ModalContent>
    </Modal>
  )
}
