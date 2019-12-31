import React from 'react';
import api from '../../api/api';

import { Card, Icon, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';

const { Meta } = Card;

const loadVideos = async () => {
  return api({
    method: 'get',
    url: '/videos',
  });
};

export default observer(() => {
  const history = useHistory();
  const state = useObservable({
    videos: [],
    loading: true,
  });

  if (state.loading) {
    loadVideos().then(res => {
      state.videos = res.data.payload;
      state.loading = false;
    });
    return (
      <div>
        <h1> Loading </h1>
      </div>
    );
  } else {
    return (
      <div style={{ padding: '20px' }}>
        {state.videos.map(video => {
          console.log(video.media['thumbnail']);
          return (
            <Card
              onClick={() => history.push(`/videos/${video._id}`)}
              key={video._id}
              style={{ width: 300, cursor: 'pointer' }}
              cover={
                <img
                  alt='example'
                  src={
                    video.media.thumbnail ||
                    'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                  }
                />
              }>
              <Meta
                // avatar={
                //   <Avatar
                //     src={
                //       video.thumbnail ||
                //       'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                //     }
                //   />
                // }
                title={video.title}
                description='This is the description'
              />
            </Card>
          );
        })}
      </div>
    );
  }
});
