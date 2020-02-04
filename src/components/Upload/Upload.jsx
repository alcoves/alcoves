import axios from 'axios';
import React, { useState } from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Button, Progress, Loader } from 'semantic-ui-react';
import { createMultipartUploadMutation, completedMultipartUploadMutation } from '../../lib/queries';

import chunkFile from '../../utils/chunkFile';

export default () => {
  const [state, setState] = useState({
    fileList: [],
    uploading: false,
    bytesUploaded: 0,
  });

  const [
    startUpload,
    { called: creCalled, loading: creLoading, data: creData, error: creError },
  ] = useMutation(createMultipartUploadMutation);

  const [
    completeUpload,
    { called: comCalled, loading: comLoading, data: comData, error: comError },
  ] = useMutation(completedMultipartUploadMutation);

  if (creData && !state.uploading && !comCalled) {
    setState({ uploading: true });
    Promise.all(
      chunkFile(state.fileList[0]).reduce((acc, blob, partIndex) => {
        let lastBytesUploaded = 0;
        console.log('getting called to upload');
        acc.push(
          axios.put(creData.createMultipartUpload.urls[partIndex], blob, {
            headers: { 'Content-Type': state.fileList[0].type },
            onUploadProgress: e => {
              state.bytesUploaded += e.loaded - lastBytesUploaded;
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
      completeUpload({ variables: { input: { objectId, parts, key, uploadId } } });
    });
  }

  if (creCalled) console.log('creCalled');
  if (creLoading) console.log('creLoading');
  if (comCalled) console.log('creCalled');

  if (creError) {
    setState({ fileList: [], uploading: false, bytesUploaded: 0 });
    console.log('creError', creError);
  }

  if (comError) {
    setState({ fileList: [], uploading: false, bytesUploaded: 0 });
    console.log('comError', comError);
  }

  if (comData && comCalled && !comLoading) {
    setState({ fileList: [], uploading: false, bytesUploaded: 0 });
    console.log('i should be redirecting!', comData);
  }

  const fileInputRef = React.createRef();

  return (
    <div
      style={{
        display: 'flex',
        padding: '20px 5px 5px 5px',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '300px',
        }}>
        <div style={{ margin: '10px 0px 10px 0px' }}>
          <Button
            content='Select Video'
            labelPosition='left'
            icon='video'
            fluid
            disabled={comLoading || creLoading || state.uploading}
            onClick={() => fileInputRef.current.click()}
          />
        </div>
        <input
          ref={fileInputRef}
          type='file'
          name='video'
          accept='video/mp4'
          files={state.fileList}
          type='file'
          hidden
          onChange={e => {
            if (!state.fileList.length) {
              setState({ fileList: [e.target.files[0]], uploading: false, bytesUploaded: 0 });
              const fileType = e.target.files[0].type;
              const parts = chunkFile(e.target.files[0]).length;
              startUpload({ variables: { input: { parts, fileType } } });
            }
          }}
        />
        <div style={{ margin: '10px 0px 10px 0px' }}>
          {state.bytesUploaded && state.fileList[0].size ? (
            <Progress
              size='small'
              percent={((state.bytesUploaded / state.fileList[0].size) * 100).toFixed(0)}
              progress='percent'
            />
          ) : null}
          {comLoading && (
            <div style={{ margin: '10px 0px 10px 0px' }}>
              <Loader active inline='centered'>
                Completing upload...
              </Loader>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
