
import axios from 'axios';
import React, { useState, useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { useApiLazy, } from '../../utils/api';

export default function UploadProgress({ file }) {
  const router = useRouter();
  const [speed, setSpeed] = useState(0)
  const [progress, setProgress] = useState(0);

  const [
    createVideo,
    {
      data: completeUploadData,
    },
  ] = useApiLazy({ url: '/videos', method: 'post' });

  const [
    createUpload,
    {
      data: createUploadData,
    },
  ] = useApiLazy({ url: '/uploads', method: 'post' });

  useEffect(() => {
    createUpload({
      data: { filename: file.name },
    });
  }, []);

  useEffect(() => {
    if (createUploadData) {
      console.log(createUploadData);
      const uploadStartTime = Date.now()

      axios
        .put(createUploadData.payload.url, file, {
          headers: { 'Content-Type': file.type },
          onUploadProgress: e => {
            const currentProgress = (e.loaded / e.total) * 100;
            const timeTaken = (Date.now() - uploadStartTime) / 1000
            const uploadSpeedMb = (e.loaded / timeTaken) / 1000000 // bytes to mb
            setSpeed(uploadSpeedMb.toFixed(1))
            setProgress(currentProgress);
          },
        })
        .then(() => {
        // Load video to get duration
          const video = document.createElement('video');
          video.setAttribute('src', window.URL.createObjectURL(file));
          video.onloadeddata = event => {
            const meta = event.srcElement; // TODO :: This is deprecated
            createVideo({
              data: {
                title: file.name,
                duration: meta.duration,
                id: createUploadData.payload.id,
              },
            });
          };
        });
    }
  }, [createUploadData]);

  if (file?.name && progress) {
    return (
      <div className='p-2 w-96'>
        <p className='text-lg text-gray-200 truncate'>
          {file.name}
        </p>
        <div className='flex flex-col justify-bottom'>
          <div className='w-full'>
            <div className='overflow-hidden h-4 text-xs flex rounded-sm bg-teal-500'>
              <div style={{ width: `${progress}%` }} className='shadow-none flex flex-row items-center text-center whitespace-nowrap text-white justify-center bg-teal-400'/>         
            </div>
          </div>
          <div className='flex flex-row justify-between pt-2 pb-2'>
            <div className='h-6 text-sm w-6 text-gray-200'>
                {speed ? `${speed}mb/s` : ""}
            </div>
            <div className='h-6 text-sm w-6 text-gray-200'>
                {`${progress.toFixed(2)}%`}
            </div>
            {progress >= 100 && (
            <button
              disabled={!completeUploadData}
              className='ml-2 px-2 py-1 text-gray-200 border rounded-md font-semibold'
              onClick={() => router.push(`/studio/${createUploadData.payload.id}`)}
            >
              Edit
            </button>
          )}
          </div>
        </div>
      </div>
    );
  }

  return <div />;
}