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
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { useCallback, useContext, useEffect, } from 'react';
import { useDropzone, } from 'react-dropzone';
import { IoVideocam, } from 'react-icons/io5';
import UploadItem from './UploadItem';
import axios from 'axios';
import chunkFile from '../../utils/chunkFile';
import { UploadContext, } from '../../context/UploadContext';

export default function Uploader({ refetch }) {
  const { uploads, dispatch } = useContext(UploadContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function startUpload(item) {
    dispatch({ type: 'start', id: item.id });
    const chunks = chunkFile(item.file);

    dispatch({ type: 'update', id: item.id, payload: { message: 'Uploading' } });
    const uploadResponse = fetch('/api/uploads', {
      method: 'POST',
      body: JSON.stringify({
        type: item.file.type,
        chunks: chunks.length,
      }),
    });
    const { uploadId, key, id, urls } = await (await uploadResponse).json();

    const results = await Promise.all(chunks.map((chunk, i) => {
      // console.log(`uploading part ${i} to ${urls[i]}`);
      return axios.put(urls[i], chunk, {
        onUploadProgress: e => {
          dispatch({ type: 'progress', id: item.id, payload: { [i]: e.loaded } });
        },
      });
    }));

    const parts = results.reduce((acc, { headers }, i) => {
      acc.push({ ETag: headers.etag, PartNumber: i+1 });
      return acc;
    }, []);
  
    dispatch({ type: 'update', id: item.id, payload: { message: 'Validating' } });
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function loadMeta() {
      window.URL.revokeObjectURL(video.src);
      const { duration } = video;

      fetch('/api/videos', {
        method: 'POST',
        body: JSON.stringify({
          id,
          key,
          parts,
          uploadId,
          duration,
          title: item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name,
        }),
      }).then(() => {
        if (refetch) refetch();
        dispatch({
          id: item.id,
          type: 'update',
          payload: { message: 'Success!', completed: true },
        });
      }).catch((error) => {
        console.error(error);
        dispatch({
          id: item.id,
          type: 'update',
          payload: { message: 'Error!', completed: true },
        });
      });
    };

    video.src = URL.createObjectURL(item.file);
  }
  
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.map((file) => {
      dispatch({ type: 'add', payload: file });
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    uploads.map((item) => {
      if (!item?.started) {
        startUpload(item);
      }
    });
  }, [uploads]);

  return (
    <>
      <Tooltip
        label='Upload'
        openDelay={300}
        aria-label='upload'
      >
        <IconButton
          onClick={onOpen}
          size='sm' ml='2'
          icon={<IoVideocam/>}
        />
      </Tooltip>
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
                {uploads.map(item => <UploadItem
                  item={item}
                  key={item.id}
                  refetch={refetch}
                  dispatch={dispatch}
                />)}
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              size='sm'
              variant='ghost'
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}