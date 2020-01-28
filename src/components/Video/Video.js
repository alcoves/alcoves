import React from 'react';
import moment from 'moment';
import gql from 'graphql-tag';
import useInterval from '../../lib/useInterval';

import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Loader, Container } from 'semantic-ui-react';
import { observer, useObservable } from 'mobx-react-lite';

const pickUrl = files => {
  let url;
  const loadOrder = ['2160p', '1440p', '1080p', '720p', 'highQuality'];
  loadOrder.map(desiredPreset => {
    files.map(({ preset, link }) => {
      // console.log(desiredPreset, preset, link);
      if (desiredPreset === preset && link) {
        url = link;
      }
    });
  });

  return url;
};

export default props => {
  const history = useHistory();
  const GET_VIDEO = gql`
    {
      video(id: "${props.id}") {
        id
        title
        views
        status
        createdAt
        user {
          id
          avatar
          displayName
        }
        files {
          link
          status
          preset
        }
      }
    }
  `;

  const { loading, data } = useQuery(GET_VIDEO);

  if (loading) {
    return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
  } else if (data) {
    const outerDivStyle = {
      backgroundColor: '#000000',
      height: 'calc(100vh - 100px)',
      maxHeight: 'calc((9 / 16) * 100vw',
    };

    const link = pickUrl(data.video.files);

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <div style={outerDivStyle}>
            <video width='100%' height='100%' controls autoPlay>
              <source src={link} type='video/mp4' />
            </video>
          </div>
          <div>
            <Container style={{ marginTop: '20px' }}>
              <div>
                <h2>{data.video.title}</h2>
                <p>
                  {data.video.views} views • {moment(parseInt(data.video.createdAt)).fromNow()}
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
                    src={data.video.user.avatar}
                    style={{
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                    onClick={() => history.push(`/users/${data.video.user.id}`)}
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
                    {data.video.user.displayName}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      height: '50%',
                      // border: 'blue solid 1px',
                    }}>
                    {data.video.user.followers || '0'} followers
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    );
  }
};

// export default observer(props => {
//   const history = useHistory();
//   const data.video = useObservable({
//     video: {},
//     url: '',
//     loading: true,
//   });

//   const handleRefresh = () => {
//     api({ url: `/videos/${props.id}`, method: 'get' }).then(({ data }) => {
//       const quality = pickVideoUrl(data.payload.files);

//       if (!quality) {
//         data.video.loading = true;
//       } else {
//         data.video.video = data.payload;
//         videoUrl = quality.link;
//         data.video.loading = false;
//       }
//     });
//   };

//   if (data.video.loading === true) {
//     handleRefresh();
//   }

//   useInterval(() => {
//     if (data.video.loading) handleRefresh();
//   }, 3000);

// });
