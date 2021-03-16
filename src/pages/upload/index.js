import axios from 'axios';
import { useState, } from 'react';
import Layout from '../../components/Layout';
import chunkFile from '../../utils/chunkFile';

export default function Upload() {
  const [files, setFiles] = useState();
  const [loading, setLoading] = useState();
  let [bytesUploaded, setBytesUploaded] = useState(0);

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

    const { uploadId, key, video_id, urls } = await (await uploadResponse).json();

    console.log('Uploading files parts');
    const parts = await uploadChunks(chunks, urls);

    console.log('Completing video upload');
    console.log({ uploadId, key, video_id, urls, parts });

    const video = document.createElement('video');
    video.setAttribute('src', window.URL.createObjectURL(file));
    video.onloadeddata = event => {
      const meta = event.srcElement; // TODO :: This is deprecated
      const body = {
        key,
        parts,
        video_id,
        uploadId,
        title: file.name,
        duration: meta.duration,
      };
      fetch('/api/videos', {
        method: 'POST',
        body: JSON.stringify(body),
      }).then((res) => {
        console.log(res);
      })
    };
  }

  return (
    <Layout>
      <div className='w-full h-full flex justify-center items-center'>
        <label htmlFor='bken-video'>Select Video</label>
        <input accept='video/mp4' onChange={({ target }) => {
          setFiles(target.files);
          startUpload(target.files[0]);
        }} id='bken-video' name='bken-video' type='file' />
      </div>
      <div>
        <p>
          {files?.length ? ((bytesUploaded / files[0].size) * 100).toFixed(0) : ''}
        </p>
      </div>
    </Layout>
  );
}