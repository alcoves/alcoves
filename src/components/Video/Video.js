import React from 'react';
import ReactPlayer from 'react-player';

import { Menu, Icon, Layout } from 'antd';
import { observer, useObservable } from 'mobx-react-lite';

const { Header, Sider, Content } = Layout;

export default () => {
  return (
    <div>
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 64px)',
          minHeight: '480px',
          maxHeight: 'calc((9 / 16) * (100vw - 80px))',
        }}>
        <ReactPlayer
          height='100%'
          width='100%'
          controls={true}
          className='react-player'
          url={[
            {
              src: 'https://s3.us-east-2.wasabisys.com/media-bken/123/train.mp4',
              type: 'video/mp4',
            },
            {
              src: 'https://s3.us-east-2.wasabisys.com/media-bken/123/train.mp4',
              type: 'video/mp4',
            },
            {
              src: 'https://s3.us-east-2.wasabisys.com/media-bken/123/train.mp4',
              type: 'video/mp4',
            },
          ]}
        />
      </div>
      <div style={{ padding: '10px' }}>
        {/* <img src='https://s3.us-east-2.wasabisys.com/media-bken/123/thumb.jpg' width='100%' /> */}
        <h3 style={{ color: 'white', padding: '5px' }}>
          {`This is a test of a title for a video that is really long so that we can test how long video titles.`}
        </h3>
      </div>
    </div>
  );
};
