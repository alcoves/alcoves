import React, { useContext } from 'react';
import UserStore from '../../data/User';
import api from '../../api/api';

import { Spin, Icon } from 'antd';
import { observer, useObservable } from 'mobx-react-lite';

const loadVideos = async userId => {
  if (userId) {
    const { data } = await api({
      method: 'get',
      url: `/users/5dd775466dafe306ba85ef53/videos`,
    });

    console.log('data', data.payload);
    return data.payload;
  }
};

export default observer(() => {
  const user = useContext(UserStore);
  const state = useObservable({
    loading: true,
    videos: [],
  });

  if (state.loading) {
    loadVideos(user.id)
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
      <h1> Your Videos </h1>
      {state.videos.map(video => {
        console.log('video', video);
        return (
          <div key={video._id} style={{ width: 400, height: 400, border: 'solid red 1px' }}>
            <h1>{video.title}</h1>
            <p>{video.status}</p>
          </div>
        );
      })}
    </div>
  );
});
