import {
  Button,
  Input,
  Modal,
  IconButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { IoAdd } from 'react-icons/io5'
import { getApiUrl } from '../../utils/api'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { fetchMutate } from '../../utils/fetcher'

export default function CreatePod() {
  const { mutate } = useSWRConfig()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function createPod() {
    try {
      setLoading(true)
      await fetchMutate({
        data: { name },
        method: 'post',
        url: `${getApiUrl()}/pods`,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      mutate(`${getApiUrl()}/pods`)
      onClose()
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a Pod</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={name}
              onChange={e => {
                setName(e.target.value)
              }}
              placeholder='New Pod Name Here!'
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='gray' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button loading={loading} colorScheme='teal' onClick={createPod}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <IconButton
        size='sm'
        onClick={onOpen}
        colorScheme='gray'
        aria-label='Create Pod'
        icon={<IoAdd size='25px' />}
      />
    </>
  )
}
