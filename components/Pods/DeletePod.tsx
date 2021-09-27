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
import { useRouter } from 'next/router'
import { useState } from 'react'
import { IoTrash } from 'react-icons/io5'
import { useSWRConfig } from 'swr'
import { getApiUrl } from '../../utils/api'
import { fetchMutate } from '../../utils/fetcher'
interface DeletePodProps {
  id: string
}

export function DeletePod(props: DeletePodProps): JSX.Element {
  const { id } = props
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  async function handleDelete() {
    try {
      setLoading(true)
      await fetchMutate({
        method: 'delete',
        url: `${getApiUrl()}/pods/${id}`,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      mutate(`${getApiUrl()}/pods`)
      router.replace('/')
    }
  }

  return (
    <>
      <IconButton
        size='sm'
        colorScheme='red'
        variant='outline'
        onClick={onOpen}
        isLoading={loading}
        aria-label='delete-pod'
        icon={<IoTrash size='15px' />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Pod</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text> Are you absolutely sure you want to delete this pod?</Text>
            <Text> Note: You must first empty the pod of videos in order to remove it</Text>
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
