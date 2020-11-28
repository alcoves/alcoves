
import axios from 'axios';

import { useHistory, } from 'react-router-dom';
import { gql, useMutation, } from '@apollo/client';
import React, { useState, useEffect, } from 'react';
import { Button, LinearProgress, Typography, } from '@material-ui/core';

const completeUploadQuery = gql`
  mutation completeUpload($input: CompleteUploadInput!) {
    completeUpload(input: $input) {
      id
    }
  }
`;

const createUploadQuery = gql`
  mutation createUpload($input: CreateUploadInput!) {
    createUpload(input: $input) {
      id
      url
    }
  }
`;

export default function UploadProgress({ file }) {
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
    <div style={{ margin: '5px 0px 5px 0px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='subtitle1'>{file.name}</Typography>
        {createUploadData && (
          <Button
            disabled={!completeUploadData}
            onClick={() => { history.push(`/editor/${createUploadData.createUpload.id}`); }}
          >
            Edit
          </Button>
        )}
      </div>
      <LinearProgress
        value={progress}
        variant='determinate'
        color={completeUploadError ? 'secondary' : 'primary'}
      />
    </div>
  );
}