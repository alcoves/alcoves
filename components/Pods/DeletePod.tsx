import {
  Text,
  List,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

import useLazyRequest from '../../hooks/useLazyRequest'
import { getAPIUrl } from '../../utils/urls'

export default function DeletePod({ id }: { id: string }) {
  const router = useRouter()
  const [create] = useLazyRequest()
  const { isOpen, onOpen, onClose } = useDisclosure()

  async function handleClick() {
    try {
      await create({
        method: 'DELETE',
        url: `${getAPIUrl()}/pods/${id}`,
      })
      router.push(`/pods`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Button size='sm' onClick={onOpen}>
        Delete
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Pod</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <List>
              <Text>{`No media will be deleted`}</Text>
              <Text>{`Pod share link will become inactive`}</Text>
              <Text>{`Users will not be able to access this pod anymore`}</Text>
            </List>
          </ModalBody>
          <ModalFooter>
            <Button size='sm' colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button size='sm' colorScheme='red' onClick={handleClick}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
