import { Box, Flex, Text, } from '@chakra-ui/layout';
import { Progress, Button } from "@chakra-ui/react"
import axios from 'axios';
import { useState, useCallback } from 'react';
import {useDropzone} from 'react-dropzone'
import chunkFile from '../utils/chunkFile';

export default function Upload() {
  const [files, setFiles] = useState([]);
  let [bytesUploaded, setBytesUploaded] = useState(0);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles)
    startUpload(acceptedFiles[0]);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop })

  async function uploadChunks(chunks, urls) {
    const results = await Promise.all(chunks.map((chunk, i) => {
      let lastBytesUploaded = 0;
      console.log(`uploading part ${i} to ${urls[i]}`);
      return axios.put(urls[i], chunk, {
        onUploadProgress: e => {
          setBytesUploaded((bytesUploaded += e.loaded - lastBytesUploaded));
          lastBytesUploaded = e.loaded;
        },
      });
    }));

    return results.reduce((acc, { headers }, i) => {
      acc.push({ ETag: headers.etag, PartNumber: i+1 });
      return acc;
    }, []);
  }

  // uploads handles chunking up a file, getting signed urls, and uploading all parts
  async function startUpload(file) {
    console.log('Chunking video');
    const chunks = chunkFile(file);
    console.log('Chunks', chunks.length);

    console.log('Fetching upload urls', file);
    const uploadBody =  JSON.stringify({
      type: file.type,
      chunks: chunks.length,
    });
    console.log(uploadBody);
    const uploadResponse = fetch('/api/uploads', {
      method: 'POST',
      body:uploadBody,
    });

    const { uploadId, key, videoId, urls } = await (await uploadResponse).json();

    console.log('Uploading files parts');
    const parts = await uploadChunks(chunks, urls);

    console.log('Completing video upload');
    console.log({ uploadId, key, videoId, urls, parts });

    const video = document.createElement('video');
    video.setAttribute('src', window.URL.createObjectURL(file));
    video.onloadeddata = event => {
      const meta = event.srcElement; // TODO :: This is deprecated
      const body = {
        key,
        parts,
        videoId,
        uploadId,
        title: file.name,
        duration: meta.duration,
      };
      fetch('/api/videos', {
        method: 'POST',
        body: JSON.stringify(body),
      }).then((res) => {
        setBytesUploaded(0)
        setFiles([])
      }).catch((error) => {
        console.log(error);
        setBytesUploaded(0)
        setFiles([])
      })
    };
  }

  function renderProgressBar() {
    let progress = 0;
    if (files.length) {
      progress = ((bytesUploaded / files[0].size) * 100).toFixed(0);
    }
    return (
      <Progress hasStripe value={progress} />
    );
  }

  return (
    <Flex>
      <Box>
        <Box {...getRootProps()}>
        <input {...getInputProps()} accept='video/mp4' multiple={false} disabled={Boolean(files.length)} />
        <Button> Upload </Button>
        </Box>
        <Box my='1'>
          {files.length ? renderProgressBar(): null}
        </Box>
      </Box>
    </Flex>
  );
}