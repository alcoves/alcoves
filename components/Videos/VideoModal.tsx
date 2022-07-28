import {
  Box,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react'

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
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent boxShadow='none'>
          <ModalCloseButton />
          <ModalBody>
            <Flex justify='center' p='2'>
              <Heading pb='2' size='md'>
                {v?.title}
              </Heading>
            </Flex>
            <Player v={v} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
