import styled from 'styled-components';
import { useDropzone, } from 'react-dropzone';
import React, { useState, useCallback, } from 'react';
import { Container, Typography, } from '@material-ui/core';
import UploadProgress from './uploadProgress';

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

function Uploader() {
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
      {/* <Typography> Uploading is temporarily disabled. </Typography> */}
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

module.exports = Uploader;
