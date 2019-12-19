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
    api({ url: `/videos/${videoId}`, method: 'get' }).then(res => {
      console.log(res.data.payload);
      state.loading = false;
      state.title = res.data.payload.title;
      state.url = res.data.payload.media.source;
    });

    return <div> Loading </div>;
  } else {
    const outerDivStyle = {
      width: '100%',
      minHeight: '480px',
      backgroundColor: 'black',
      height: 'calc(100vh - 64px)',
      maxHeight: 'calc((9 / 16) * 100vw',
    };

    return (
      <div>
        <div style={outerDivStyle}>
          <ReactPlayer height='100%' width='100%' controls={true} url={state.url} />
        </div>
        <div style={{ padding: '10px' }}>
          <h3 style={{ color: 'white', padding: '5px' }}>{state.title}</h3>
        </div>
      </div>
    );
  }
});
