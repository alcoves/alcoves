import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { IoTrashSharp } from 'react-icons/io5'

import useLazyRequest from '../../hooks/useLazyRequest'
import { getAPIUrl } from '../../utils/urls'

export default function DeleteVideo({ videoId }: { videoId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [removeMedia, { loading }] = useLazyRequest()

  async function handleRemove() {
    try {
      await removeMedia({
        method: 'DELETE',
        url: `${getAPIUrl()}/videos/${videoId}`,
      })
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <IconButton
        size='xs'
        onClick={onOpen}
        colorScheme='red'
        icon={<IoTrashSharp />}
        aria-label='delete-video'
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to permenantly delete this video? This action is irreversible!
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} variant='ghost' onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='red' isLoading={loading} onClick={handleRemove}>
              Permanently Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
