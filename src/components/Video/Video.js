import React from 'react';
import api from '../../api/api';
import ReactPlayer from 'react-player';

import { Helmet } from 'react-helmet';
import { observer, useObservable } from 'mobx-react-lite';

const InjectMetadata = state => {
  return (
    <Helmet>
      <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      />
      <title>{state.title}</title>
      <meta property='fb:pages' content='784080431636131' />
      <meta property='og:site_name' content='bken.io' />
      <meta property='og:title' content={state.title} />
      <meta name='twitter:title' content={state.title} />
      <meta
        name='description'
        content='Check out this video on bken.io using your phone, tablet or desktop.'
      />
      <link rel='shortcut icon' href='https://bken.io/favicon.ico' />
      <meta property='og:type' content='video.other' />
      <meta property='og:image' content={state.thumbnail} />
      <meta property='og:image:secure_url' content={state.thumbnail} />
      <meta property='og:image:type' content='image/jpeg' />
      <meta property='og:image:width' content='1921' />
      <meta property='og:image:height' content='804' />
      <meta property='og:updated_time' content='2020-01-03T01:20:49.520951' />
      <meta property='og:url' content='https://bken.io/g5evc' />
      <meta property='og:video' content={state.url} />
      <meta property='og:video:url' content={state.url} />
      <meta property='og:video:secure_url' content={state.url} />
      <meta property='og:video:type' content='video/mp4' />
      <meta property='og:video:width' content='1920' />
      <meta property='og:video:height' content='1080' />
      <meta name='twitter:card' content='player' />
      <meta name='twitter:site' content='@bken-io' />
      <meta name='twitter:image' content={state.thumbnail} />
      <meta name='twitter:player:width' content='1921' />
      <meta name='twitter:player:height' content='804' />
      <meta name='twitter:player' content='https://bken.io/t/g5evc' />
      <meta name='twitter:player:stream' content={state.url} />
      <meta name='twitter:player:stream:content_type' content='video/mp4' />
      <link rel='amphtml' href='https://streamable.com/amp_player/g5evc' />
      {/* <link
      rel='alternate'
      type='application/json+oembed'
      href='https://api.streamable.com/oembed?url=https://streamable.com/g5evc'
      title='oEmbed'
    /> */}
    </Helmet>
  );
};

export default observer(props => {
  const state = useObservable({
    url: '',
    title: '',
    loading: true,
  });

  if (!props.id) {
    return <div> Invalid Video ID </div>;
  }

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

    return <div> Loading </div>;
  } else {
    const outerDivStyle = {
      width: '100%',
      minHeight: '480px',
      backgroundColor: 'black',
      height: 'calc(100vh - 50px)',
      maxHeight: 'calc((9 / 16) * 100vw',
    };

    return (
      <div>
        <InjectMetadata state={state} />
        <div style={outerDivStyle}>
          <ReactPlayer playing height='100%' width='100%' controls={true} url={state.url} />
        </div>
        <div style={{ padding: '10px' }}>
          <h3 style={{ color: 'white', padding: '5px' }}>{state.title}</h3>
          <h5>{`quality: ${state.url.split('/')[state.url.split('/').length - 1]}`}</h5>
        </div>
      </div>
    );
  }
});
