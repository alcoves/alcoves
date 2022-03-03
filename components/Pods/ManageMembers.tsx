import { IoPeopleOutline } from 'react-icons/io5'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

export default function ManageMembers() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button size='sm' leftIcon={<IoPeopleOutline />} onClick={onOpen}>
        Users
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Users</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text> Here is your invite link </Text>
            <Text> Admins must permit entry </Text>
            Show the members
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
