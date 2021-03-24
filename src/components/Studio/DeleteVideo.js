import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';
import {
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { DeleteIcon } from '@chakra-ui/icons';
import { useState } from 'react';

export default function DeleteVideo({ id }) {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()

  async function deleteVideo() {
    try {
      setLoading(true)
      await axios.delete(`/api/videos/${id}`);
      onClose()
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <IconButton
        size='xs'
        fontSize="20px"
        onClick={onOpen}
        variant="outline"
        colorScheme="red"
        isLoading={loading}
        aria-label="Delete Video"
        icon={<DeleteIcon w='3' h='3' />}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Permanently Delete Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you absolutely sure you want to delete this video?
            This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={deleteVideo}>
              Delete Forever
            </Button>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}