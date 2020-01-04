import React from 'react';
import api from '../../api/api';

import { Loader } from 'semantic-ui-react';
import { observer, useObservable } from 'mobx-react-lite';

const pickVideoUrl = files => {
  if (files['2160p'] && files['2160p'].link) return files['2160p'].link;
  if (files['1440p'] && files['1440p'].link) return files['1440p'].link;
  if (files['1080p'] && files['1080p'].link) return files['1080p'].link;
  if (files['720p'] && files['720p'].link) return files['720p'].link;
  if (files.highQuality && files.highQuality.link) return files.highQuality.link;
};

export default observer(props => {
  const state = useObservable({
    url: '',
    title: '',
    loading: true,
  });

  if (state.loading || !state.url) {
    api({ url: `/videos/${props.id}`, method: 'get' }).then(({ data }) => {
      state.loading = false;
      state.title = data.payload.title;
      state.url = pickVideoUrl(data.payload.files);
    });

    return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
  } else {
    const outerDivStyle = {
      backgroundColor: '#000000',
      height: 'calc(100vh - 100px)',
      maxHeight: 'calc((9 / 16) * 100vw',
    };

    return (
      <div>
        <div style={outerDivStyle}>
          <video width='100%' height='100%' controls autoPlay>
            <source src={state.url} type='video/mp4' />
          </video>
        </div>
        <div style={{ padding: '10px' }}>
          <h3 style={{ color: 'white', padding: '5px' }}>{state.title}</h3>
          <h5>{`quality: ${
            state.url.split('/')[state.url.split('/').length - 1].split('.')[0]
          }`}</h5>
        </div>
      </div>
    );
  }
});
