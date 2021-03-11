import { useState } from 'react';
import Layout from '../../components/Layout';
import chunkFile from '../../utils/chunkFile';

export default function() {
  const [files, setFiles] = useState()

  // uploads handles chunking up a file, getting signed urls, and uploading all parts
  function upload(file) {
    console.log('Chunking video');
    const chunks = chunkFile(file);
    console.log("Chunks", chunks.length);

    console.log('Fetching upload urls');
    // call start upload

    console.log('Uploading files parts');
    // batch upload urls

    console.log('Completing video upload');
  }

  return (
    <Layout>
      <div className="w-full h-full flex justify-center items-center">
        <label for="bken-video">Select Video</label>
        <input accept="video/mp4" onChange={({ target }) => {
          upload(target.files[0])
        }} id="bken-video" name="bken-video" type="file"></input>
      </div>
    </Layout>
  )
}