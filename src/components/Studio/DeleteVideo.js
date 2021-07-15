import axios from 'axios';
import {
  Button,
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
import { IoTrashBin, } from 'react-icons/io5';

export default function DeleteVideo({ id, refetch }) {
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
      if (refetch) refetch();
      setLoading(false);
    }
  }

  return (
    <>
      <Button size='sm' onClick={onOpen} leftIcon={<IoTrashBin/>}>
        Delete
      </Button>
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
            <Button
              mr={3} size='sm'
              colorScheme='red'
              isLoading={loading}
              onClick={deleteVideo}
              leftIcon={<IoTrashBin/>}
            >
              Delete Forever
            </Button>
            <Button size='sm' variant='ghost' onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}