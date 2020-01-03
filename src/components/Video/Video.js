import React from 'react';
import api from '../../api/api';

import { Helmet } from 'react-helmet';
import { Loader } from 'semantic-ui-react';
import { observer, useObservable } from 'mobx-react-lite';

export default observer(props => {
  const state = useObservable({
    url: '',
    title: '',
    loading: true,
  });

  if (state.loading) {
    api({ url: `/videos/${props.id}`, method: 'get' }).then(res => {
      state.loading = false;
      state.title = res.data.payload.title;
      state.url =
        res.data.payload.media['2160p'] ||
        res.data.payload.media['1440p'] ||
        res.data.payload.media['1080p'] ||
        res.data.payload.media['720p'] ||
        res.data.payload.media.source;
    });

    return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
  } else {
    const outerDivStyle = {
      backgroundColor: '#000000',
      height: 'calc(100vh - 50px)',
      maxHeight: 'calc((9 / 16) * 100vw',
    };

    return (
      <div>
        <div style={outerDivStyle}>
          <video width='100%' height='100%' controls autoplay>
            <source src={state.url} type='video/mp4' />
          </video>
        </div>
        <div style={{ padding: '10px' }}>
          <h3 style={{ color: 'white', padding: '5px' }}>{state.title}</h3>
          <h5>{`quality: ${state.url.split('/')[state.url.split('/').length - 1]}`}</h5>
        </div>
      </div>
    );
  }
});
