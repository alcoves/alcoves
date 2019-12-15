import React from 'react';
import axios from 'axios';

import { useObservable, observer } from 'mobx-react-lite';
import { Upload, message, Button, Icon, Progress } from 'antd';

export default observer(() => {
  const state = useObservable({
    fileList: [],
    uploadUrl: '',
    uploadProgress: 0,
  });

  const handleUpload = e => {
    const { name, type } = state.fileList[0];
    axios
      .post('http://localhost:3000/videos/upload', { type: type, name })
      .then(({ data }) => {
        state.uploadUrl = data.payload.url;
        axios
          .put(state.uploadUrl, state.fileList[0], {
            headers: { 'Content-Type': type },
            onUploadProgress: e => {
              state.uploadProgress = Math.floor((e.loaded / e.total) * 100);
            },
          })
          .then(res => {
            state.fileList = [];
            state.uploadProgress = 0;
          })
          .catch(error => {
            state.fileList = [];
            state.uploadProgress = 0;
            console.error('error', error);
          });
      })
      .catch(error => {
        state.fileList = [];
        state.uploadProgress = 0;
        console.error(error);
      });
  };

  const beforeUpload = file => {
    state.uploadProgress = 0;
    state.fileList = [file];
    return false;
  };

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
          height: '74px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '5px',
        }}>
        <Upload beforeUpload={beforeUpload} fileList={state.fileList}>
          <Button style={{ width: '120px' }}>
            <Icon type='upload' /> Select File
          </Button>
        </Upload>
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '5px',
        }}>
        <Button
          type='primary'
          onClick={handleUpload}
          disabled={state.fileList.length === 0}
          style={{ width: '120px' }}
          loading={Boolean(state.uploadProgress)}>
          {state.uploadProgress ? 'Uploading' : 'Start Upload'}
        </Button>
      </div>
      <div
        style={{
          width: '100%',
          padding: '5px',
          display: 'flex',
          justifyContent: 'center',
        }}>
        {state.uploadProgress ? <Progress type='circle' percent={state.uploadProgress} /> : null}
      </div>
    </div>
  );
});
