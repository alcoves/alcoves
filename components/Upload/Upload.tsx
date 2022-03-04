import UploadVideo from './UploadVideo'
import { useDropzone } from 'react-dropzone'
import { useCallback, useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Input,
  useColorMode,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react'
import { IoCloudUpload } from 'react-icons/io5'

export default function Upload() {
  const { colorMode } = useColorMode()
  const [files, setFiles] = useState([]) as any
  const { isOpen, onOpen, onClose } = useDisclosure()
  const onDrop = useCallback(acceptedFiles => {
    setFiles((prev: any) => [...prev, ...acceptedFiles])
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  const borderColor = colorMode === 'dark' ? 'gray.700' : 'gray.100'

  return (
    <>
      <Button size='sm' variant='ghost' leftIcon={<IoCloudUpload size='18px' />} onClick={onOpen}>
        Upload
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction='column' align='center'>
              <Box w='100%'>
                <Flex
                  {...getRootProps()}
                  p='4'
                  h='200px'
                  align='center'
                  justify='center'
                  borderWidth='2px'
                  borderStyle='dashed'
                  borderColor={borderColor}
                >
                  <input {...getInputProps()} />
                  <Heading size='md'> Drop here or select to upload </Heading>
                </Flex>
                <Input my='2' placeholder='Import video from URL' />
                {files.length ? (
                  <VStack direction='column' mt='4'>
                    <Heading size='md'> Uploading Queue </Heading>
                    {files.map((f: any, i: number) => (
                      <UploadVideo key={i} file={f} />
                    ))}
                  </VStack>
                ) : null}
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
