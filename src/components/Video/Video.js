import dayjs from 'dayjs';
import React from 'react';
import api from '../../api/api';
import useInterval from '../../lib/useInterval';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useHistory } from 'react-router-dom';
import { Loader, Container } from 'semantic-ui-react';
import { observer, useObservable } from 'mobx-react-lite';

dayjs.extend(relativeTime);

const pickVideoUrl = files => {
  if (files['2160p'] && files['2160p'].link) return { format: '2160p', link: files['2160p'].link };
  if (files['1440p'] && files['1440p'].link) return { format: '1440p', link: files['1440p'].link };
  if (files['1080p'] && files['1080p'].link) return { format: '1080p', link: files['1080p'].link };
  if (files['720p'] && files['720p'].link) return { format: '720p', link: files['720p'].link };
  if (files['highQuality'] && files['highQuality'].link)
    return { format: 'highQuality', link: files['highQuality'].link };
};

export default observer(props => {
  const history = useHistory();
  const state = useObservable({
    video: {},
    url: '',
    loading: true,
  });

  const handleRefresh = () => {
    api({ url: `/videos/${props.id}`, method: 'get' }).then(({ data }) => {
      const quality = pickVideoUrl(data.payload.files);

      if (!quality) {
        state.loading = true;
      } else {
        state.video = data.payload;
        state.url = quality.link;
        state.loading = false;
      }
    });
  };

  if (state.loading === true) {
    handleRefresh();
  }

  useInterval(() => {
    if (state.loading) handleRefresh();
  }, 3000);

  if (state.loading || !state.url) {
    return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
  } else {
    const outerDivStyle = {
      backgroundColor: '#000000',
      height: 'calc(100vh - 100px)',
      maxHeight: 'calc((9 / 16) * 100vw',
    };

    console.log(JSON.stringify(state.video));

    return (
      <div>
        <div style={outerDivStyle}>
          <video width='100%' height='100%' controls autoPlay>
            <source src={state.url} type='video/mp4' />
          </video>
        </div>

        <div>
          <Container style={{ marginTop: '20px' }}>
            <div>
              <h2>{state.video.title}</h2>
              <p>
                {state.video.views} views • {dayjs(state.video.createdAt).fromNow()} •
                {state.url.split('/')[state.url.split('/').length - 1].split('.')[0]}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: '10px',
                height: '75px',
              }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: '10px',
                }}>
                <img
                  width={50}
                  height={50}
                  alt='profile'
                  src={state.video.user.avatar}
                  style={{
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                  onClick={() => history.push(`/users/${state.video.user._id}`)}
                />
              </div>

              <div style={{ height: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    height: '50%',
                    // border: 'blue solid 1px',
                  }}>
                  {state.video.user.displayName}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    height: '50%',
                    // border: 'blue solid 1px',
                  }}>
                  {state.video.user.followers} followers
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }
});
