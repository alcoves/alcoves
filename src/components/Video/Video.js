import React from 'react';
import api from '../../api/api';
import useInterval from '../../lib/useInterval';

import { Loader } from 'semantic-ui-react';
import { observer, useObservable } from 'mobx-react-lite';

const pickVideoUrl = files => {
  if (files['2160p'] && files['2160p'].link) return { format: '2160p', link: files['2160p'].link };
  if (files['1440p'] && files['1440p'].link) return { format: '1440p', link: files['1440p'].link };
  if (files['1080p'] && files['1080p'].link) return { format: '1080p', link: files['1080p'].link };
  if (files['720p'] && files['720p'].link) return { format: '720p', link: files['720p'].link };
  if (files['highQuality'] && files['highQuality'].link)
    return { format: 'highQuality', link: files['highQuality'].link };
};

export default observer(props => {
  const state = useObservable({
    url: '',
    title: '',
    loading: true,
    percentCompleted: 0,
  });

  const handleRefresh = () => {
    api({ url: `/videos/${props.id}`, method: 'get' }).then(({ data }) => {
      const quality = pickVideoUrl(data.payload.files);

      if (!quality) {
        state.loading = true;
      } else {
        state.loading = false;
        state.url = quality.link;
        state.title = data.payload.title;
        state.percentCompleted = data.payload.files[quality.format].percentCompleted;
      }
    });
  };

  if (state.loading === true) {
    handleRefresh();
  }

  useInterval(() => {
    if (state.percentCompleted !== 100) {
      handleRefresh();
    }
  }, 3000);

  if (state.loading || !state.url) {
    return (
      <Loader active inline='centered' style={{ marginTop: '30px' }}>
        {`${state.percentCompleted}%`}
      </Loader>
    );
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
