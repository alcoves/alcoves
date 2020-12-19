import styled from 'styled-components';
import { useDropzone, } from 'react-dropzone';
import React, { useState, useCallback, useContext, } from 'react';
import { Heading, Box, } from 'grommet';
import UploadProgress from './uploadProgress';
import { Context, } from '../../utils/store';
import Layout from '../../components/Layout';

const Dropzone = styled.div`
  display: flex;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  min-height: 200px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  border: dashed 3px #E4E7EB;
`;

export default function Uploader() {
  const { authenticated } = useContext(Context);
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: Boolean(files.length),
    accept: 'video/mp4,video/quicktime',
  });

  if (!authenticated) {
    return <div> Please log in to upload </div>;
  }

  return (
    <Layout>
      <Box
        width='100%'
        height='100%'
        display='flex'
        align='center'
        justify='center'
      >
        <Dropzone {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <Heading level='4'> Drop here! </Heading>
          ) : (
            <Heading level='4'> Upload </Heading>
          )}
        </Dropzone>
        {files.map(file => <UploadProgress key={file.name} file={file} />)}
      </Box>
    </Layout>
  );
}
