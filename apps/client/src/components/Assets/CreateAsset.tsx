import { useSWRConfig } from 'swr'
import { createRequest } from '../../lib/api'
import {
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import useSWRMutation from 'swr/mutation'
import { useState } from 'react'
import APIErrorAlert from '../APIErrorAlert'

export default function CreateAsset() {
  const createAsset = createRequest('POST')
  const { mutate } = useSWRConfig()
  const [input, setInput] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { trigger, error } = useSWRMutation('/api/assets', createAsset)

  async function handleCreate() {
    await trigger({ input })
    await mutate(`/api/assets`)
    onClose()
  }

  return (
    <>
      <Button onClick={onOpen}>Create</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              size="md"
              variant="filled"
              placeholder="url"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
              }}
            />
            {error && <APIErrorAlert error={error} />}
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              isDisabled={!Boolean(input)}
              colorScheme="teal"
              onClick={handleCreate}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
