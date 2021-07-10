import { Box, Text, Progress, } from '@chakra-ui/react';
import { useEffect, useState, } from 'react';
import axios from 'axios';
import chunkFile from '../../utils/chunkFile';

function getTotalProgress(file = {}, bytesUploaded = {}) {
  const totalBytesLoaded = Object.values(bytesUploaded).reduce((acc, cv) => {
    acc += cv;
    return acc;
  }, 0);
  return parseInt(((totalBytesLoaded / file.size || 0) * 100).toFixed(0));
}

export default function UploadVideo({ file, refetch }) {
  const [message, setMessage] = useState('Loading');
  const [bytesUploaded, setBytesUploaded] = useState({});

  async function uploadFile() {
    console.debug('Chunking file');
    setMessage('Parsing');
    const chunks = chunkFile(file);

    // Start upload
    console.debug('Fetching upload urls');
    setMessage('Uploading');
    const uploadResponse = fetch('/api/uploads', {
      method: 'POST',
      body: JSON.stringify({
        type: file.type,
        chunks: chunks.length,
      }),
    });

    console.debug('Parsing response');
    const { uploadId, key, videoId, urls } = await (await uploadResponse).json();

    console.log('Uploading files parts');
    const results = await Promise.all(chunks.map((chunk, i) => {
      console.log(`uploading part ${i} to ${urls[i]}`);
      return axios.put(urls[i], chunk, {
        onUploadProgress: e => {
          setBytesUploaded(prevState => ({ ...prevState, [i]: e.loaded }));
        },
      });
    }));

    const parts = results.reduce((acc, { headers }, i) => {
      acc.push({ ETag: headers.etag, PartNumber: i+1 });
      return acc;
    }, []);
  
    console.log('Completing video upload');
    setMessage('Validating');
    console.log({ uploadId, key, videoId, urls, parts });

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
          title: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
        }),
      }).then(() => {
        if (refetch) refetch();
        setMessage('Success!');
      }).catch((error) => {
        console.error(error);
        setMessage('There was an error');
      });
    };

    video.src = URL.createObjectURL(file);
  }

  useEffect(() => uploadFile(), []);

  return(
    <Box borderWidth='2px' my='2' rounded='md' p='2'>
      <Text fontSize='.8rem' fontWeight='800'>{file.name}</Text>
      <Text fontSize='.8rem' opacity='.7'>{message}</Text>
      <Progress mt='2' rounded='md' h='2' value={getTotalProgress(file, bytesUploaded)} />
    </Box>
  );
}