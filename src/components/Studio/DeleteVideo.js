import axios from 'axios';
import {
  Button,
  Box,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useState, } from 'react';

export default function DeleteVideo({ id }) {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function deleteVideo() {
    try {
      setLoading(true);
      await axios.delete(`/api/videos/${id}`);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Box onClick={onOpen}>
        Delete Video
      </Box>
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
            <Button colorScheme='red' mr={3} onClick={deleteVideo} isLoading={loading}>
              Delete Forever
            </Button>
            <Button variant='ghost' onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}