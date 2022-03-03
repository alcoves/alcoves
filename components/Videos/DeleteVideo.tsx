import useLazyRequest from '../../hooks/useLazyRequest'
import { useSWRConfig } from 'swr'
import { getAPIUrl } from '../../utils/urls'
import { IoTrashSharp } from 'react-icons/io5'
import {
  Button,
  Modal,
  ModalBody,
  IconButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalCloseButton,
} from '@chakra-ui/react'

export default function DeleteVideo({ podId, videoId }: { podId: string; videoId: string }) {
  const { mutate } = useSWRConfig()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [removeMedia, { loading }] = useLazyRequest()

  async function handleRemove() {
    try {
      await removeMedia({
        method: 'DELETE',
        url: `${getAPIUrl()}/pods/${podId}/videos/${videoId}`,
      })
      mutate(`${getAPIUrl}/pods/${podId}/videos`)
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
            <Button colorScheme='blue' isLoading={loading} mr={3} variant='ghost' onClick={onClose}>
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
