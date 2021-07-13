import {
  Box,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useCallback, useEffect, useReducer, } from 'react';
import { useDropzone, } from 'react-dropzone';
import { IoVideocam, } from 'react-icons/io5';
import UploadItem from './UploadItem';
import UploadReducer from './UploadReducer';
import axios from 'axios';
import chunkFile from '../../utils/chunkFile';

export default function Uploader({ refetch }) {
  const [uploads, dispatch] = useReducer(UploadReducer, []);

  async function startUpload(item) {
    dispatch({ type: 'start', id: item.id });
    const chunks = chunkFile(item.file);

    dispatch({ type: 'message', id: item.id, payload: 'Uploading' });
    const uploadResponse = fetch('/api/uploads', {
      method: 'POST',
      body: JSON.stringify({
        type: item.file.type,
        chunks: chunks.length,
      }),
    });
    const { uploadId, key, videoId, urls } = await (await uploadResponse).json();

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
  
    dispatch({ type: 'message', id: item.id, payload: 'Validating' });
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function loadMeta() {
      window.URL.revokeObjectURL(video.src);
      const { duration } = video;

      fetch('/api/videos', {
        method: 'POST',
        body: JSON.stringify({
          key,
          parts,
          videoId,
          uploadId,
          duration,
          title: item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name,
        }),
      }).then(() => {
        if (refetch) refetch();
        dispatch({ type: 'message', id: item.id, payload: 'Success!' });
      }).catch((error) => {
        console.error(error);
        dispatch({ type: 'message', id: item.id, payload: 'Error!' });
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

  useEffect(() => {
    return function cleanup() {
      console.log('Uploader is unmounting');
      // comfirm('Are your sure?');
    };
  }, []);

  return (
    <Flex direction='column'>
      <Box
        mt='4'
        rounded='md'
        cursor='pointer'
        borderWidth='2px'
        {...getRootProps()}
        borderStyle='dashed'
      >
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
  );
}