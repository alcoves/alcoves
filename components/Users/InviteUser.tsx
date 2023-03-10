import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Input,
  VStack,
} from '@chakra-ui/react'
import { IoPersonSharp } from 'react-icons/io5'

export default function InviteUser() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button size='sm' onClick={onOpen} leftIcon={<IoPersonSharp />}>
        Invite
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing='2'>
              <Text>{`Enter a valid email address. We'll send them an email with a link to join.`}</Text>
              <Input placeholder='email@example.com' />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='gray' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Invite</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
