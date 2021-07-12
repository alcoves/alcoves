import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Button,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import { nanoid, } from 'nanoid';
import { useCallback, useEffect, useState, } from 'react';
import { useDropzone, } from 'react-dropzone';
import { IoVideocam, } from 'react-icons/io5';
import UploadVideo from './UploadVideo';

export default function Uploader({ refetch }) {
  const [files, setFiles] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.map((f) => {
      f.id = nanoid();
      setFiles(ps => [...ps, f]);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => function cleanup() {
    setFiles([]);
  }, []);

  return (
    <>
      <Button ml='2' size='sm' onClick={onOpen}>Upload Videos</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Flex direction='column'>
              <Box mt='4' {...getRootProps()} borderWidth='2px' borderStyle='dashed' rounded='md' cursor='pointer'>
                <input {...getInputProps()} />
                <Flex direction='column' justify='center' align='center' minH='200px'>
                  <IoVideocam size='40px'/>
                  <Heading size='md'>Upload Videos</Heading>
                  <Text>Drop videos here, or click to browse</Text>
                </Flex>
              </Box>
              <Box>
                {files.map(f => <UploadVideo key={f.id} file={f} refetch={refetch}/>)}
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}