import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  Text,
  Box,
} from '@chakra-ui/react'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'
import { IoSettings } from 'react-icons/io5'
import useLazyRequest from '../../hooks/useLazyRequest'
import { useEffect } from 'react'

export default function PodSettings() {
  const router = useRouter()
  const { podId } = router.query
  const { mutate } = useSWRConfig()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deletePod, { data, error, loading }] = useLazyRequest()

  function handleDelete() {
    deletePod({
      method: 'DELETE',
      url: `http://localhost:4000/pods/${podId}`,
    })
  }

  useEffect(() => {
    if (data && !error && !loading) {
      mutate('http://localhost:4000/pods')
      router.push('/')
    }
  }, [data, error, loading])

  return (
    <>
      <IconButton aria-label='pod-settings' onClick={onOpen} icon={<IoSettings />} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pod Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>The pod must be empty for the pod to be deleted successfully</Text>
            <Button isLoading={loading} size='sm' colorScheme='red' onClick={handleDelete}>
              Delete Pod
            </Button>
            <Box>{error ? <Text color='brand.red'>{error}</Text> : null}</Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
