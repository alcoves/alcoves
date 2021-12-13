import {
  Modal,
  Input,
  Button,
  ModalBody,
  IconButton,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { IoAddSharp } from 'react-icons/io5'
import useLazyRequest from '../../hooks/useLazyRequest'

export default function CreatePod() {
  const { mutate } = useSWRConfig()
  const [podName, setPodName] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [createPod, { loading }] = useLazyRequest({
    method: 'POST',
    url: 'http://localhost:4000/pods',
  })

  async function handleSubmit() {
    try {
      await createPod({
        data: { name: podName },
      })
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      mutate('http://localhost:4000/pods')
    }
  }

  return (
    <>
      <IconButton
        size='xs'
        variant='ghost'
        onClick={onOpen}
        aria-label='create-pod'
        icon={<IoAddSharp size='15px' />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Pod</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={podName}
              onChange={e => {
                setPodName(e.target.value)
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button isLoading={loading} onClick={handleSubmit} variant='solid' colorScheme='teal'>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
