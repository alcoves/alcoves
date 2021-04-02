import {
  Flex,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure, } from '@chakra-ui/react';

export default function ShareModal({ link }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return(
    <>
      <Button onClick={onOpen} size='sm'>Share</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              w='100%'
              alignItems='center'
              justifyContent='space-between'
            >
              <Text>{link}</Text>
              <Button
                size='sm'
                variant='outline'
                onClick={() => {navigator.clipboard.writeText(link);}}
              >
                Copy
              </Button>
            </Flex>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
}