import { Box, Heading, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'

import { Video } from '../../types/types'
import Player from '../Player/Player'

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
      <Modal size='3xl' isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='transparent' boxShadow='none' p='4'>
          <Box>
            <Heading pb='2' size='md'>
              {v?.title}
            </Heading>
            <Player v={v} />
          </Box>
        </ModalContent>
      </Modal>
    </>
  )
}
