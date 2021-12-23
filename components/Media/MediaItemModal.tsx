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

export default function MediaItemModal({ isOpen, onClose, m }: any) {
  const playerRef = useRef(null)

  const videoJsOptions = {
    fluid: true,
    autoplay: true,
    controls: true,
    responsive: true,
    sources: [
      {
        src: m.url,
        type: m.type,
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
            <Heading size='md'>{m.title}</Heading>
            <Button> Optimize </Button>
            <Button> Delete source file </Button>
            <pre>{JSON.stringify(m, null, 2)}</pre>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
