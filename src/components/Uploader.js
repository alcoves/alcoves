import axios from 'axios';
import { useState, } from 'react';
import chunkFile from '../utils/chunkFile';

export default function Upload() {
  const [files, setFiles] = useState([]);
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
        console.log(res);
        window.location.reload();
      });
    };
  }

  function renderProgressBar() {
    let progress = 0;
    if (files.length) {
      progress = ((bytesUploaded / files[0].size) * 100).toFixed(0);
    }
    return (
      <div className='relative pt-1'>
        <div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200'>
          <div style={{ width: `${progress}%` }} className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-row justify-center align-center py-4'>
      <div className='w-48'>
        <label>
          <span className='rounded-md uppercase text-gray-200 border cursor-pointer text-sm font-bold tracking-wide p-2'>Upload</span>
          <input accept='video/mp4' onChange={({ target }) => {
            setFiles(target.files);
            startUpload(target.files[0]);
          }} id='bken-video' className='hidden' name='bken-video' type='file' />
        </label>
        <div className='my-2'>
          {files.length ? renderProgressBar(): null}
        </div>
      </div>
    </div>
  );
}