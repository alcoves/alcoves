import { Heading, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'

import { Video } from '../../types/types'

import Player from './Player'

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
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w='auto' maxW='80vw' bg='transparent' boxShadow='none' p='4'>
          <Heading pb='2' size='md'>
            {v?.title}
          </Heading>
          <Player v={v} />
        </ModalContent>
      </Modal>
    </>
  )
}
