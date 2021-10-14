import {
  Flex,
  Avatar,
  AvatarGroup,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'

interface member {
  _id: string
  name: string
  image: string
}

export default function ListMembers(props: { members: member[] }): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Flex direction='column' akign='center'>
      <Button h='75px' variant='ghost' onClick={onOpen}>
        <AvatarGroup size='md' max={4}>
          {props?.members?.map(m => {
            return <Avatar key={m._id} name={m.name} src={m.image} />
          })}
        </AvatarGroup>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pod Members</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction='column'>
              {props?.members?.map(m => {
                return (
                  <Flex key={m._id} py='1' align='center'>
                    <Avatar size='sm' name={m.name} src={m.image} />
                    <Text fontSize='sm' pl='2'>
                      {m.name}
                    </Text>
                  </Flex>
                )
              })}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}
