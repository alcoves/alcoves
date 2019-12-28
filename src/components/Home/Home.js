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
      <div>
        {state.videos.map(video => {
          return (
            <Card
              onClick={() => history.push(`/videos/${video._id}`)}
              key={video._id}
              style={{ width: 300, cursor: 'pointer' }}
              cover={
                <img
                  alt='example'
                  src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                />
              }
              // actions={[
              //   <Icon type='setting' key='setting' />,
              //   <Icon type='edit' key='edit' />,
              //   <Icon type='ellipsis' key='ellipsis' />,
              // ]}>
            >
              <Meta
                avatar={
                  <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
                }
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
