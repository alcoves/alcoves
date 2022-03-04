import Player from './Player'
import { Flex, Heading, Modal, ModalContent, ModalOverlay, Spinner } from '@chakra-ui/react'
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
      <Modal size='6xl' isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='transparent' boxShadow='none'>
          <Heading pb='2' size='md'>
            {v?.title}
          </Heading>
          <Flex justify='center' align='center' bg='black'>
            {v?.status === 'READY' ? (
              <Flex maxH='700px'>
                <Player src={getHlsUrl(v?.cdnUrl)} />
              </Flex>
            ) : (
              <Flex minH='700px' justify='center' align='center'>
                <Spinner size='xl' />
              </Flex>
            )}
          </Flex>
        </ModalContent>
      </Modal>
    </>
  )
}
