import axios from 'axios';
import styled from 'styled-components';

import {useDropzone,} from 'react-dropzone';
import { useHistory, } from 'react-router-dom';
import { useMutation, } from '@apollo/client';
import React, { useState, useEffect, useCallback, } from 'react';
import { LinearProgress, Container, CircularProgress, Typography,
} from '@material-ui/core';

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
        onUploadProgress: (e) => {
          const currentProgress = (e.loaded / file.size) * 100;
          console.log(currentProgress);
          setProgress(currentProgress);
        },
      })
      .then(() => {
        // Load video to get duration
        const video = document.createElement('video');
        video.setAttribute('src', window.URL.createObjectURL(file));
        video.onloadeddata = (event) => {
          const meta = event.srcElement; // TODO :: This is deprecated
          completeUpload({
            variables: {
              input: {
                id, title: file.name, duration: meta.duration, fileType: file.type,
              },
            },
          });
        };
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <div>{JSON.stringify(error)}</div>;
  return <LinearProgress variant='determinate' value={progress} />;
}

const Dropzone = styled.div`
  width: 100%
  height: 200px;
  border-radius: 4px;
  border: dashed 2px grey;
`;

function SimpleUploader() {
  const [file, setFile] = useState(null);
  const [createUpload, { called, loading, data }] = useMutation(createUploadQuery);

  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({ 
    onDrop, 
    accept: 'video/mp4', 
    disabled: Boolean(loading || called),
  });

  useEffect(() => {
    if (file) createUpload({ variables: { input: { fileType: file.type } } });
  }, [file]);

  return (
    <Container maxWidth='xs' style={{ paddingTop: '20px' }}>
      <Dropzone {...getRootProps()}>
        <input {...getInputProps()} />
        { isDragActive ?
          <Typography variant='body1'> Drop here </Typography> :
          <Typography variant='body1'> Select a Video </Typography>}
      </Dropzone>
      {data && file && (
        <UploadProgress id={data.createUpload.id} url={data.createUpload.url} file={file} />
      )}
    </Container>
  );
}

module.exports = SimpleUploader;
