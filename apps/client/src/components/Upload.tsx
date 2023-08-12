import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
} from '@chakra-ui/react'
import { IoCloudUploadSharp } from 'react-icons/io5'

export default function Upload() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} leftIcon={<IoCloudUploadSharp />}>
        Upload
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload a video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Upload via url is currently the only supported method. Plase
              provide a link to a video.
            </Text>
            <Text>
              The video will be downloaded and ready for playback in its current
              format. Transcoding is not supported.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Import</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
