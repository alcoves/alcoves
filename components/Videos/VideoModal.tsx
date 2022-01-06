import Player from './Player'
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
import { getHlsUrl } from '../../utils/urls'

export default function MediaItemModal({
  v,
  isOpen,
  onClose,
}: {
  v: Video
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <>
      <Modal size='6xl' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Player src={getHlsUrl(v.id)} />
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
