import React from 'react';
import api from '../../api/api';
import ReactPlayer from 'react-player';

import { observer, useObservable } from 'mobx-react-lite';

export default observer(() => {
  const state = useObservable({
    url: '',
    title: '',
    loading: true,
  });

  if (state.loading) {
    const videoId = window.location.pathname.split('/videos/')[1];
    api.getVideo(videoId).then(res => {
      state.loading = false;
      state.title = res.data.payload.title;
    });

    return <div> Loading </div>;
  } else {
    return (
      <div>
        <div
          style={{
            width: '100%',
            height: 'calc(100vh - 64px)',
            minHeight: '480px',
            maxHeight: 'calc((9 / 16) * 100vw',
          }}>
          <ReactPlayer
            height='100%'
            width='100%'
            controls={true}
            className='react-player'
            url={[
              {
                src: state.url,
                type: 'video/mp4',
              },
            ]}
          />
        </div>
        <div style={{ padding: '10px' }}>
          {/* <img src='https://s3.us-east-2.wasabisys.com/media-bken/123/thumb.jpg' width='100%' /> */}
          <h3 style={{ color: 'white', padding: '5px' }}>{state.title}</h3>
        </div>
      </div>
    );
  }
});
