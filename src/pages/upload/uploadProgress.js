
import axios from 'axios';
import React, { useState, useEffect, } from 'react';
import { Heading, Pane, } from 'evergreen-ui';
import { lazyApi, } from '../../utils/api';

export default function UploadProgress({ file }) {
  const [progress, setProgress] = useState(0);

  const [
    completeUpload,
    {
      data: completeUploadData,
      error: completeUploadError,
      loading: completeUploadLoading,
    },
  ] = lazyApi('/uploads', 'put');

  const [
    createUpload,
    {
      data: createUploadData,
      error: createUploadError,
      loading: createUploadLoading,
    },
  ] = lazyApi('/uploads', 'post');

  useEffect(() => {
    createUpload({
      data: { fileType: file.type },
    });
  }, []);

  useEffect(() => {
    axios
      .put(createUploadData.url, file, {
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
          completeUpload({
            data: {
              title: file.name,
              fileType: file.type,
              id: createUploadData.id,
              duration: meta.duration,
            },
          });
        };
      });
  }, [createUploadData]);

  if (file?.name && progress) {
    return (
      <Pane>
        <Heading>{file.name}</Heading>
        <Heading>{progress}</Heading>
      </Pane>
    );
  }

  return <div />;
}