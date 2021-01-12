
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
      error: completeUploadError,
      loading: completeUploadLoading,
    },
  ] = useApiLazy('/videos', 'post');

  const [
    createUpload,
    {
      data: createUploadData,
      error: createUploadError,
      loading: createUploadLoading,
    },
  ] = useApiLazy('/uploads', 'post');

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
      <div width='300px' margin='small'>
        <p truncate>
          {file.name}
        </p>
        <br />
        <div direction='row' align='center'>
          <Meter
            aria-label='meter'
            values={[{ value: progress }]}
          />
          <Button
            size='small'
            label='Edit'
            style={{ marginLeft: '10px' }}
            disabled={!completeUploadData}
            onClick={() => router.push(`/studio/${createUploadData.payload.id}`)}
          />
        </div>
      </div>
    );
  }

  return <div />;
}