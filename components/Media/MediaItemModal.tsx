import {
  // useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Heading,
  Button,
  ModalBody,
  AspectRatio,
} from '@chakra-ui/react'

export default function MediaItemModal({ isOpen, onClose, m }: any) {
  return (
    <>
      <Modal size='6xl' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <AspectRatio ratio={16 / 9}>
            <video autoPlay controls src={m.url} />
          </AspectRatio>
          <ModalBody>
            <Heading size='md'>{m.title}</Heading>
            <Button> Optimize </Button>
            <Button> Delete source file </Button>
            <pre>{JSON.stringify(m, null, 2)}</pre>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
