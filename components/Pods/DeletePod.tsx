import useLazyRequest from '../../hooks/useLazyRequest'
import { useRouter } from 'next/router'
import { getAPIUrl } from '../../utils/urls'
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { IoRemoveCircleOutline } from 'react-icons/io5'
import { useSWRConfig } from 'swr'

export default function DeletePod({ id }: { id: string }) {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deletePod, { error, loading }] = useLazyRequest()

  async function handleDelete() {
    await deletePod({
      method: 'DELETE',
      url: `${getAPIUrl()}/pods/${id}`,
    })

    onClose()
    mutate(`${getAPIUrl()}/pods`)
    router.push('/')
  }

  return (
    <Box>
      <Button
        size='sm'
        colorScheme='red'
        onClick={onOpen}
        isLoading={loading}
        leftIcon={<IoRemoveCircleOutline />}
      >
        {error ? 'Failed!' : 'Delete Pod'}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Pod</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text> Are your sure you want to delete this pod?</Text>
            <Text color='red.500' fontWeight='800'>
              This action is irreversable. All data will be removed
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Nevermind
            </Button>
            <Button colorScheme='red' onClick={handleDelete}>
              Permanently Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
