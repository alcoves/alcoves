
import axios from 'axios';
import React, { useState, useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { useApiLazy, } from '../../utils/api';

export default function UploadProgress({ file }) {
  const router = useRouter();
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
      axios
        .put(createUploadData.payload.url, file, {
          headers: { 'Content-Type': file.type },
          onUploadProgress: e => {
            const currentProgress = (e.loaded / file.size) * 100;
            console.log(currentProgress);
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
        <p className='text-lg text-gray-200' truncate>
          {file.name}
        </p>
        <div className='flex flex-row items-center'>
          <div className='w-full'>
            <div className='overflow-hidden h-4 text-xs flex rounded-sm bg-teal-500'>
              <div style={{ width: `${progress}%` }} className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-400' />
            </div>
          </div>
          {progress >= 100 && (
            <button
              className='ml-2 px-2 py-1 text-gray-200 border rounded-md font-semibold'
              disabled={!completeUploadData}
              onClick={() => router.push(`/studio/${createUploadData.payload.id}`)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    );
  }

  return <div />;
}