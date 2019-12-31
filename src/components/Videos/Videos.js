import React from 'react';
import api from '../../api/api';

import { Spin, Icon, Button, Tag, Input, Tooltip } from 'antd';
import { observer, useObservable } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';

const loadVideos = async userId => {
  if (userId) {
    const { data } = await api({
      method: 'get',
      url: `/users/${userId}/videos`,
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

  const userId = props.match.params.userId;
  const state = useObservable({
    loading: true,
    videos: [],
  });

  const handleRefresh = () => {
    loadVideos(userId).then(videos => {
      state.videos = videos;
    });
  };

  const handleView = e => {
    history.push(`/videos/${e.target.id}`);
  };

  if (state.loading) {
    loadVideos(userId)
      .then(videos => {
        state.videos = videos;
        state.loading = false;
      })
      .catch(() => {
        state.loading = false;
      });

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
        {state.videos.map(video => {
          return (
            <div
              key={video._id}
              style={{
                width: '400px',
                height: 'auto',
                backgroundColor: 'rgb(0, 21, 41)',
                border: 'solid white 1px',
                margin: '10px',
                padding: '10px',
              }}>
              <h1>{video.title}</h1>
              <h5>Video ID : {video._id}</h5>
              <h5>Authord ID : {video.author}</h5>
              <p>
                Status:
                {video.status !== 'completed' ? (
                  <Icon type='setting' theme='filled' spin />
                ) : (
                  video.status
                )}
              </p>
              {video.media &&
                Object.entries(video.media).map(([k, v]) => {
                  return (
                    <Tag color='green' key={k} closable={false}>
                      {k}
                    </Tag>
                  );
                })}
              <Button id={video._id} type='primary' onClick={handleView}>
                View
              </Button>
              <Button id={video._id} type='danger' onClick={handleDelete}>
                Delete
              </Button>
            </div>
          );
        })}
      </div>
    );
  }
});
