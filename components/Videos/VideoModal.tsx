import Player from './Player'
import { useRef } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Heading,
  Button,
  ModalBody,
} from '@chakra-ui/react'
import { Video } from '../../types/types'
import { getOriginalUrl } from '../../utils/urls'

export default function MediaItemModal({
  v,
  isOpen,
  onClose,
}: {
  v: Video
  isOpen: boolean
  onClose: () => void
}) {
  const playerRef = useRef(null)

  const videoJsOptions = {
    fluid: true,
    autoplay: true,
    controls: true,
    responsive: true,
    sources: [
      {
        type: 'video/mp4',
        src: getOriginalUrl(v.id),
      },
    ],
  }

  const handlePlayerReady = (player: any) => {
    playerRef.current = player
    player.on('waiting', () => {
      console.log('player is waiting')
    })
    player.on('dispose', () => {
      console.log('player will dispose')
    })
  }

  return (
    <>
      <Modal size='6xl' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Player options={videoJsOptions} onReady={handlePlayerReady} />
          <ModalBody>
            <Heading size='md'>{v.title}</Heading>
            <Button> Optimize </Button>
            <Button> Delete source file </Button>
            <pre>{JSON.stringify(v, null, 2)}</pre>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
