import UploadList from './UploadList'
import { useDropzone } from 'react-dropzone'
import {
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react'
import { useCallback, useContext } from 'react'
import { IoCloudUpload } from 'react-icons/io5'
import { UploadsContext } from '../contexts/uploads'

const acceptedContentTypes = ['.mp4']

export default function UploadButton() {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { uploads, addUpload } = useContext(UploadsContext)
  const inProgressUpload = Object.values(uploads).filter(u => u.file.size !== u.completed)

  const onDrop = useCallback(acceptedFiles => {
    console.log('Accepted Files', acceptedFiles)
    acceptedFiles.map((f: File) => addUpload(f))
  }, [])

  function onDropRejected() {
    console.error('There was an error')
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: 50,
    multiple: true,
    accept: acceptedContentTypes.join(', '),
  })

  return (
    <>
      <Button
        w='100%'
        size='sm'
        variant='ghost'
        onClick={onOpen}
        leftIcon={
          Boolean(inProgressUpload.length) ? <Spinner size='xs' /> : <IoCloudUpload size='20px' />
        }
      >
        Upload
      </Button>
      <Modal size='3xl' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <ModalHeader>Upload</ModalHeader>
            <Flex {...getRootProps()} w='100%' justify='center'>
              <input {...getInputProps()} />
              <Button
                aria-label='upload'
                leftIcon={<IoCloudUpload size='20px' />}
                rightIcon={Boolean(inProgressUpload.length) ? <Spinner size='xs' /> : <></>}
              >
                Select Files
              </Button>
            </Flex>
            <UploadList />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
