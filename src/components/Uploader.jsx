import axios from 'axios';
import VideoIcon from '@material-ui/icons/MovieOutlined';

import { useHistory, } from 'react-router-dom';
import { useMutation, } from '@apollo/client';
import React, { useState, useEffect, } from 'react';
import { Button, LinearProgress, Container, CircularProgress, } from '@material-ui/core';

import createUploadQuery from '../gql/createUpload';
import completeUploadQuery from '../gql/completeUpload';

function UploadProgress({ id, url, file }) {
  const history = useHistory();
  const [progress, setProgress] = useState(0);

  const [completeUpload, { loading, data, error }] = useMutation(completeUploadQuery);

  useEffect(() => {
    if (data) history.push(`/editor/${id}`);
  });

  useEffect(() => {
    axios
      .put(url, file, {
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
            variables: {
              input: { id, title: file.name, duration: meta.duration, fileType: file.type },
            },
          });
        };
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <div>{JSON.stringify(error)}</div>;
  return <LinearProgress variant='determinate' value={progress} />;
}

function SimpleUploader() {
  const [file, setFile] = useState(null);
  const fileInputRef = React.createRef();
  const [createUpload, { called, loading, data }] = useMutation(createUploadQuery);

  useEffect(() => {
    if (file) createUpload({ variables: { input: { fileType: file.type } } });
  }, [file]);

  return (
    <Container maxWidth='xs' style={{ paddingTop: '20px' }}>
      <Button
        fullWidth
        size='large'
        color='primary'
        variant='contained'
        startIcon={<VideoIcon />}
        disabled={called || loading}
        onClick={() => fileInputRef.current.click()}
      >
        Select Video
      </Button>
      <input
        hidden
        type='file'
        name='video'
        ref={fileInputRef}
        accept='video/mp4'
        onChange={e => {
          setFile(e.target.files[0]);
        }}
      />
      {data && file && (
        <UploadProgress id={data.createUpload.id} url={data.createUpload.url} file={file} />
      )}
    </Container>
  );
}

module.exports = SimpleUploader;
