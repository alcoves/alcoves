import axios from 'axios';
import styled from 'styled-components';

import { useDropzone, } from 'react-dropzone';
import { useHistory, } from 'react-router-dom';
import { useMutation, } from '@apollo/client';
import React, { useState, useEffect, useCallback, } from 'react';
import { Button, LinearProgress, Container, Typography, } from '@material-ui/core';

import createUploadQuery from '../gql/createUpload';
import completeUploadQuery from '../gql/completeUpload';

function UploadProgress({ file }) {
  const history = useHistory();
  const [progress, setProgress] = useState(0);

  const [createUpload, { called: createUploadCalled, data: createUploadData }] = useMutation(
    createUploadQuery
  );
  const [completeUpload, { data: completeUploadData, error: completeUploadError }] = useMutation(
    completeUploadQuery
  );

  useEffect(() => {
    if (!createUploadCalled && !createUploadData) {
      createUpload({ variables: { input: { fileType: file.type } } });
    }
  }, []);

  useEffect(() => {
    if (createUploadData) {
      axios
        .put(createUploadData.createUpload.url, file, {
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
                input: {
                  title: file.name,
                  fileType: file.type,
                  duration: meta.duration,
                  id: createUploadData.createUpload.id,
                },
              },
            });
          };
        });
    }
  }, [createUploadData]);

  if (completeUploadError) return <div>{JSON.stringify(completeUploadError)}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='subtitle1'>{file.name}</Typography>
        {createUploadData && (
          <Button
            onClick={() => {
              history.push(`/editor/${createUploadData.createUpload.id}`);
            }}
          >
            Edit
          </Button>
        )}
      </div>
      <LinearProgress variant='determinate' value={progress} />
    </div>
  );
}

const Dropzone = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  cursor: pointer;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  border: dashed 3px grey;
`;

function SimpleUploader() {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'video/mp4,video/quicktime',
    disabled: Boolean(files.length),
  });

  return (
    <Container maxWidth='xs' style={{ paddingTop: '20px' }}>
      <Dropzone {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant='subtitle1'> Drop here! </Typography>
        ) : (
          <Typography variant='subtitle1'> Upload </Typography>
        )}
      </Dropzone>
      {files.map(file => {
        return <UploadProgress key={file.name} file={file} />;
      })}
    </Container>
  );
}

module.exports = SimpleUploader;
