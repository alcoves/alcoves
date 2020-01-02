import React from 'react';
import api from '../../api/api';

import { Spin, Icon, Button, Tag } from 'antd';
import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';

const loadVideo = async videoId => {
  if (videoId) {
    const { data } = await api({
      method: 'get',
      url: `/videos/${videoId}`,
    });
    return data.payload;
  }
};

const handleDelete = async e => {
  try {
    await api({
      method: 'delete',
      url: `/videos/${e.target.id}`,
    });

    window.location.reload();
  } catch (error) {
    throw error;
  }
};

export default observer(props => {
  const history = useHistory();

  const videoId = props.match.params.videoId;
  const state = useObservable({
    loading: true,
    video: {},
  });

  const handleRefresh = () => {
    loadVideo(videoId)
      .then(video => {
        state.video = video;
        state.loading = false;
      })
      .catch(error => {
        console.error(error);
        state.loading = false;
      });
  };

  const handleView = e => {
    history.push(`/videos/${e.target.id}`);
  };

  if (state.loading) {
    handleRefresh();

    return (
      <div>
        <Spin indicator={<Icon type='loading' style={{ fontSize: 24 }} spin />} />
      </div>
    );
  } else {
    return (
      <div>
        <Button type='default' onClick={handleRefresh}>
          Refresh
        </Button>
        <div
          style={{
            width: '400px',
            height: 'auto',
            backgroundColor: 'rgb(0, 21, 41)',
            border: 'solid white 1px',
            margin: '10px',
            padding: '10px',
          }}>
          <h1>{state.video.title}</h1>
          <h5>Video ID : {state.video._id}</h5>
          <h5>Authord ID : {state.video.author}</h5>
          <p>
            Status:
            {state.video.status !== 'completed' ? (
              <Icon type='setting' theme='filled' spin />
            ) : (
              state.video.status
            )}
          </p>
          {state.video.media &&
            Object.entries(state.video.media).map(([k, v]) => {
              return (
                <Tag color='green' key={k} closable={false}>
                  {k}
                </Tag>
              );
            })}
          <Button id={state.video._id} type='primary' onClick={handleView}>
            View
          </Button>
          <Button id={state.video._id} type='danger' onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    );
  }
});
