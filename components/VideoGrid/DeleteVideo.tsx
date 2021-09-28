import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { IoTrash } from 'react-icons/io5'
import { useSWRConfig } from 'swr'
import { getApiUrl } from '../../utils/api'
import { fetchMutate } from '../../utils/fetcher'

export default function DeleteVideo(props: { id: string; podId: string }): JSX.Element {
  const { mutate } = useSWRConfig()
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  async function handleDelete() {
    try {
      setLoading(true)
      await fetchMutate({
        method: 'delete',
        url: `${getApiUrl()}/videos/${props.id}`,
      })
    } catch (error) {
      console.error(error)
    } finally {
      onClose()
      setLoading(false)
      mutate(`${getApiUrl()}/pods/${props.podId}/videos`)
    }
  }

  return (
    <>
      <IconButton aria-label='delete-video' onClick={onOpen} size='sm' icon={<IoTrash />} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text> Are you absolutely sure you want to delete this video?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleDelete} colorScheme='red' isLoading={loading} variant='solid'>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
