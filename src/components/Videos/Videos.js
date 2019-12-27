import React from 'react';
import api from '../../api/api';

import { Spin, Icon, Button } from 'antd';
import { observer, useObservable } from 'mobx-react-lite';

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
  const userId = props.match.params.userId;
  const state = useObservable({
    loading: true,
    videos: [],
  });

  if (state.loading) {
    loadVideos(userId)
      .then(videos => {
        state.videos = videos;
        console.log('done');
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
  }
  return (
    <div>
      <h1> Videos </h1>
      {state.videos.map(video => {
        console.log('video', video);
        return (
          <div key={video._id} style={{ width: '400px', height: '400px', border: 'solid red 2px' }}>
            {Object.entries(video).map(([k, v]) => {
              return <p>{`key: ${k}  |  value: ${v}`}</p>;
            })}
            <Button id={video._id} type='danger' onClick={handleDelete}>
              Delete
            </Button>
          </div>
        );
      })}
    </div>
  );
});
