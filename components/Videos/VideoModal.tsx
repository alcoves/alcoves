import { Box, Heading, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'

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
  let size
  const aspectRatio = v.height / v.width

  if (aspectRatio >= 1) {
    size = 'xs'
  } else {
    size = '2xl'
  }

  return (
    <>
      <Modal size={size} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='transparent' boxShadow='none' p='4'>
          <Heading pb='2' size='md'>
            {v?.title}
          </Heading>
          <Box>
            <Player v={v} />
          </Box>
        </ModalContent>
      </Modal>
    </>
  )
}
