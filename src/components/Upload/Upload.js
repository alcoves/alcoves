import React from 'react';
import axios from 'axios';
import api from '../../api/api';

import { useHistory } from 'react-router-dom';
import { Button, Progress, Loader } from 'semantic-ui-react';
import { useObservable, observer } from 'mobx-react-lite';

export default observer(() => {
  const history = useHistory();
  const state = useObservable({
    fileList: [],
    uploadUrl: '',
    queuing: false,
    uploading: false,
    bytesUploaded: 0,
  });

  const completeVideoUpload = async ({ key, uploadId, parts }) => {
    try {
      console.log('completing video upload');
      state.queuing = true;
      const completeRes = await api({
        method: 'post',
        url: '/uploads',
        data: {
          key,
          parts,
          uploadId,
        },
      });

      console.log('upload complete!');
      history.push(`/editor/videos/${completeRes.data.payload.videoId}`);
    } catch (error) {
      console.error('complete video upload error', error);
    } finally {
      state.queuing = false;
    }
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

  const uploadParts = async (file, { key, uploadId }) => {
    try {
      state.uploading = true;
      const resolvedUploads = await Promise.all(
        chunkFile(file).reduce((acc, blob, partIndex) => {
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
                  let lastBytesUploaded = 0;
                  axios
                    .put(data.payload.url, blob, {
                      headers: { 'Content-Type': file.type },
                      onUploadProgress: e => {
                        state.bytesUploaded += e.loaded - lastBytesUploaded;
                        lastBytesUploaded = e.loaded;
                      },
                    })
                    .then(resolve)
                    .catch(reject);
                })
                .catch(reject);
            }),
          );

          return acc;
        }, []),
      );

      const parts = resolvedUploads.reduce((acc, { headers }, i) => {
        acc.push({ ETag: headers.etag, PartNumber: i + 1 });
        return acc;
      }, []);

      return { key, parts, uploadId };
    } catch (error) {
      console.log('upload error', error);
    } finally {
      state.uploading = false;
    }
  };

  const startUpload = async file => {
    try {
      console.log('starting upload');
      const { data } = await api({
        method: 'post',
        url: '/videos',
        data: {
          fileName: file.name,
          fileType: file.type,
        },
      });

      const completeVideoUploadObj = await uploadParts(file, data.payload);
      await completeVideoUpload(completeVideoUploadObj);
    } catch (err) {
      console.log(err);
    }
  };

  let fileInputRef = React.createRef();

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
            disabled={state.uploading || state.queuing}
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
            state.bytesUploaded = 0;
            state.fileList = [e.target.files[0]];
          }}
        />
        <div style={{ margin: '10px 0px 10px 0px' }}>
          <Button
            fluid
            onClick={() => startUpload(state.fileList[0])}
            disabled={state.fileList.length === 0 || state.uploading || state.queuing}>
            Upload
          </Button>
        </div>
        <div style={{ margin: '10px 0px 10px 0px' }}>
          {state.fileList.length ? <h3>{state.fileList[0].name}</h3> : null}
        </div>
        <div style={{ margin: '10px 0px 10px 0px' }}>
          {state.bytesUploaded && state.fileList[0].size ? (
            <Progress
              size='small'
              percent={((state.bytesUploaded / state.fileList[0].size) * 100).toFixed(0)}
              progress='percent'
            />
          ) : null}
        </div>
        {state.queuing ? (
          <div style={{ margin: '10px 0px 10px 0px' }}>
            <Loader active inline='centered'>
              Completing upload...
            </Loader>
          </div>
        ) : null}
      </div>
    </div>
  );
});
