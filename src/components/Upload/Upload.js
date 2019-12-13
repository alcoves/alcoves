import React from 'react';

import { useObservable, observer } from 'mobx-react-lite';
import { Upload, message, Button, Icon } from 'antd';
import axios from 'axios';

export default observer(() => {
  const state = useObservable({
    uploading: false,
    uploadUrl: '',
    fileList: [],
  });

  const beforeUpload = file => {
    state.fileList.push(file);
    return false;
  };

  const handleUpload = e => {
    console.log('Uploading video', state.fileList[0]);
    const { name, lastModified, size, type, uid } = state.fileList[0];

    state.uploading = true;

    axios
      .post('http://localhost:3000/videos/upload', { type: type, name })
      .then(({ data }) => {
        state.uploadUrl = data.payload.url;
        console.log(state.uploadUrl);

        axios
          .put(state.uploadUrl, state.fileList[0], {
            headers: { 'Content-Type': type },
          })
          .then(res => {
            state.uploading = false;
            console.log('video uploaded!', res);
          })
          .catch(error => {
            state.fileList = [];
            state.uploading = false;

            console.error('error', error);
          });
      })
      .catch(error => {
        state.uploading = false;
        console.error(error);
      });
  };

  const changeHandler = e => {
    state.fileList = e.target.files;
    console.log(state.fileList);
  };

  return (
    <div>
      <input type='file' name='file' onChange={changeHandler} />

      <button onClick={handleUpload}>upload </button>

      {/* <Upload beforeUpload={beforeUpload} fileList={state.fileList}>
        <Button>
          <Icon type='upload' /> Select File
        </Button>
      </Upload>
      <Button
        type='primary'
        onClick={handleUpload}
        disabled={!Boolean(state.fileList)}
        loading={state.uploading}
        style={{ marginTop: 16 }}>
        {state.uploading ? 'Uploading' : 'Start Upload'}
      </Button> */}
    </div>
  );
});
