import './Upload.css';
import axios from 'axios';
import chunkFile from '../../utils/chunkFile';
import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Button, Progress, Loader } from 'semantic-ui-react';
import { createMultipartUploadMutation, completedMultipartUploadMutation } from '../../lib/queries';

export default () => {
  const history = useHistory();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  let [bytesUploaded, setBytesUploaded] = useState(0);

  const [
    startUpload,
    { called: creCalled, loading: creLoading, data: creData, error: creError },
  ] = useMutation(createMultipartUploadMutation);

  const [
    completeUpload,
    { called: comCalled, loading: comLoading, data: comData, error: comError },
  ] = useMutation(completedMultipartUploadMutation);

  if (creData && !uploading && !comCalled) {
    setUploading(true);
    Promise.all(
      chunkFile(files[0]).reduce((acc, blob, partIndex) => {
        let lastBytesUploaded = 0;
        acc.push(
          axios.put(creData.createMultipartUpload.urls[partIndex], blob, {
            headers: { 'Content-Type': files[0].type },
            onUploadProgress: e => {
              setBytesUploaded((bytesUploaded += e.loaded - lastBytesUploaded));
              lastBytesUploaded = e.loaded;
            },
          }),
        );

        return acc;
      }, []),
    ).then(res => {
      const parts = res.reduce((acc, { headers }, i) => {
        acc.push({ ETag: headers.etag, PartNumber: i + 1 });
        return acc;
      }, []);

      const { objectId, key, uploadId } = creData.createMultipartUpload;
      console.log('--- COMPLETING VIDEO UPLOAD ---');
      completeUpload({ variables: { input: { objectId, parts, key, uploadId } } });
    });
  }

  console.log({
    creCalled,
    creLoading,
    creData,
    creError,
    comCalled,
    comLoading,
    comData,
    comError,
  });

  if (creError || comError) {
    setUploading(false);
    setBytesUploaded(0);
    setFiles([]);
    console.log('creError', creError);
    console.log('comError', comError);
  }

  if (comData && comCalled && !comLoading && uploading) {
    setUploading(false);
    setBytesUploaded(0);
    setFiles([]);
    console.log('i should be redirecting!', comData);
  }

  useEffect(() => {
    if (files.length) {
      console.log('starting file upload process');
      const fileType = files[0].type;
      const parts = chunkFile(files[0]).length;

      // Load the video into the browser to get the duration
      const video = document.createElement('video');
      video.setAttribute('src', window.URL.createObjectURL(files[0]));
      video.onloadeddata = event => {
        const meta = event.srcElement;
        console.log('Video metadata', meta);
        startUpload({ variables: { input: { parts, fileType, duration: meta.duration } } });
      };
    }
  }, [files]);

  const fileInputRef = React.createRef();

  return (
    <div className='uploadContainer'>
      <div className='uploadRow'>
        <Button
          fluid
          icon='video'
          labelPosition='left'
          content='Select Video'
          onClick={() => fileInputRef.current.click()}
          disabled={comLoading || creLoading || uploading}
        />
        <input
          hidden
          type='file'
          name='video'
          type='file'
          accept='video/mp4'
          ref={fileInputRef}
          onChange={e => {
            if (!files.length) {
              setFiles([e.target.files[0]]);
            }
          }}
        />
        <div className='uploadRow'>
          {bytesUploaded && files[0].size ? (
            <Progress
              size='small'
              progress='percent'
              percent={((bytesUploaded / files[0].size) * 100).toFixed(0)}
            />
          ) : null}
          {comLoading && (
            <Loader active inline='centered'>
              Completing upload...
            </Loader>
          )}
        </div>
        <div className='uploadRow'>
          {comData && creData ? (
            <Button
              fluid
              positive
              onClick={() => {
                history.push(`/editor/videos/${creData.createMultipartUpload.objectId}`);
              }}>
              View In Editor
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
