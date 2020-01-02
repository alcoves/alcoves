import React from 'react';
import axios from 'axios';
import api from '../../api/api';

import { useHistory } from 'react-router-dom';
import { Upload, Button, Icon, Progress, message } from 'antd';
import { useObservable, observer } from 'mobx-react-lite';

export default observer(() => {
  const history = useHistory();
  const state = useObservable({
    fileList: [],
    uploadUrl: '',
    uploadProgress: 0,
    numberOfParts: 0,
    numberOfPartsCompleted: 0,
  });

  const beforeUpload = file => {
    state.uploadProgress = 0;
    state.fileList = [file];
    return false;
  };

  const chunkFile = file => {
    let start, end, blob;

    const parts = [];
    const fileSize = file.size;
    const FILE_CHUNK_SIZE = 10000000 * 5; // 50MB
    const NUM_CHUNKS = Math.floor(fileSize / FILE_CHUNK_SIZE) + 1;

    for (let index = 1; index < NUM_CHUNKS + 1; index++) {
      start = (index - 1) * FILE_CHUNK_SIZE;
      end = index * FILE_CHUNK_SIZE;
      blob = index < NUM_CHUNKS ? file.slice(start, end) : file.slice(start);
      parts.push(blob);
    }

    return parts;
  };

  const uploadMultipartFile = async (file, { uploadId, key }) => {
    try {
      const resolvedUploads = await Promise.all(
        chunkFile(file).reduce((acc, blob, partIndex) => {
          state.numberOfParts++;
          acc.push(
            new Promise((resolve, reject) => {
              api({
                method: 'get',
                url: '/uploads/url',
                params: {
                  key,
                  uploadId,
                  partNumber: partIndex + 1,
                },
              })
                .then(({ data }) => {
                  axios
                    .put(data.payload.url, blob, {
                      headers: { 'Content-Type': file.type },
                    })
                    .then(res => {
                      state.numberOfPartsCompleted++;
                      resolve(res);
                    })
                    .catch(err => reject);
                })
                .catch(err => reject);
            }),
          );

          return acc;
        }, []),
      );

      const uploadPartsArray = resolvedUploads.reduce((acc, { headers }, i) => {
        acc.push({ ETag: headers.etag, PartNumber: i + 1 });
        return acc;
      }, []);

      await api({
        method: 'post',
        url: '/uploads',
        data: {
          key,
          uploadId,
          parts: uploadPartsArray,
        },
      });

      history.push(`/editor/videos/${key.split('/')[0]}`);
      console.log('upload complete!');
    } catch (error) {
      console.log('Upload Error', error);
      message.error('there was an error while uploading');
    }
  };

  const startUpload = async file => {
    try {
      const { data } = await api({
        method: 'post',
        url: '/videos',
        data: {
          fileName: file.name,
          fileType: file.type,
        },
      });

      return uploadMultipartFile(file, data.payload);
    } catch (err) {
      console.log(err);
    }
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
          onClick={() => startUpload(state.fileList[0])}
          disabled={state.fileList.length === 0}
          style={{ width: '120px' }}
          loading={Boolean(state.numberOfParts)}>
          {state.numberOfParts ? 'Uploading' : 'Start Upload'}
        </Button>
      </div>
      <div
        style={{
          width: '100%',
          padding: '5px',
          display: 'flex',
          justifyContent: 'center',
        }}>
        {state.numberOfParts ? (
          <Progress
            type='circle'
            percent={parseInt(
              ((state.numberOfPartsCompleted / state.numberOfParts) * 100).toFixed(0),
            )}
          />
        ) : null}
      </div>
    </div>
  );
});
