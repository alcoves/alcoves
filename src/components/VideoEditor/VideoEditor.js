import React from 'react';
import api from '../../api/api';

import { Spin, Icon, Button, Tag, Input, Tooltip } from 'antd';
import { observer, useObservable } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';

const loadVideos = async (userId, videoId) => {
  if (userId) {
    const { data } = await api({
      method: 'get',
      url: `/users/${userId}/videos/${videoId}`,
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
    video: {},
  });

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
        <div>{state.video.title}</div>
      </div>
    );
  }
});
