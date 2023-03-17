import axios from 'axios'

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
  VStack,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { IoPersonSharp } from 'react-icons/io5'

export default function InviteUser() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const mutation = useMutation({
    mutationFn: () => {
      return axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/invites`)
    },
  })

  async function handleCopy() {
    try {
      // Fetch invite link from server /invites
      const inviteLink = await mutation.mutate()
      console.log('inviteLink', inviteLink)

      // Copy the link to clipboard

      // Close the modal and create a toast notification
      onClose()
    } catch (error) {
      // Handle the error
    }
  }

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
              <Text>{`This is your invite link. Only share it with people you trust. They can use this link to create an account. Once they register you must verify them.`}</Text>
              <Button w='100%' onClick={handleCopy}>
                Copy Invite Link
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
