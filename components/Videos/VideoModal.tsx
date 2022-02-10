import Player from './Player'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Heading,
  ModalBody,
  Spinner,
  Flex,
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
          {v?.status === 'READY' ? (
            <Player src={getHlsUrl(v?.id)} />
          ) : (
            <Flex justify='center' align='center' w='100%' h='300px'>
              <Spinner />
            </Flex>
          )}
          <ModalBody>
            <Heading size='md'>{v?.title}</Heading>
            <pre>{JSON.stringify(v, null, 2)}</pre>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
