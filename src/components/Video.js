import moment from 'moment';
import React, { useState, useEffect } from 'react';

import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Link, useParams } from 'react-router-dom';
import { Loader, Container, Dropdown } from 'semantic-ui-react';

const QUERY = gql`
  query getVideo($id: String!) {
    video(id: $id) {
      id
      title
      views
      createdAt
      user {
        id
        avatar
        userName
      }
      versions {
        link
        status
        preset
      }
    }
  }
`;

const pickUrl = ({ versions }, override) => {
  const loadOrder = [
    'libvpx_vp9-2160p',
    'libx264-2160p',
    'libvpx_vp9-1440p',
    'libx264-1440p',
    'libvpx_vp9-1080p',
    'libx264-1080p',
    'libvpx_vp9-720p',
    'libx264-720p',
    'libvpx_vp9-480p',
    'libx264-480p',
  ];
  for (const desiredPreset of loadOrder) {
    for (const v of versions) {
      if (override && override === v.preset && v.link) return v;
      if (desiredPreset === v.preset && v.link) return v;
    }
  }
};

function Video({ data }) {
  const outerDivStyle = {
    backgroundColor: '#000000',
    height: 'calc(100vh - 300px)',
    maxHeight: 'calc((9 / 16) * 100vw',
  };

  const [version, setVersion] = useState(pickUrl(data.video));
  console.log('version', version, version.link);

  useEffect(() => {
    const video = document.getElementById('bkenVideoPlayer');
    const currentTime = video.currentTime;
    video.src = version.link;
    video.play();
    video.currentTime = currentTime;
  }, [version]);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <div style={outerDivStyle}>
            {version.link ? (
              <video id='bkenVideoPlayer' width='100%' height='100%' controls autoPlay>
                <source src={version.link} type='video/mp4' />
              </video>
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  flexDirection: 'column',
                }}>
                <Loader inline active />
              </div>
            )}
          </div>
          <div>
            <Container style={{ marginTop: '20px' }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <div style={{ fontSize: '1.4em', fontWeight: '400' }}>{data.video.title}</div>
                  <Dropdown
                    upward
                    item
                    button
                    floating
                    value={version.preset}
                    onChange={(e, { value }) => {
                      console.log('changing quality', e, value);
                      setVersion(pickUrl(data.video, value));
                    }}
                    options={data.video.versions.reduce((acc, v) => {
                      if (v.link) {
                        acc.push({
                          key: v.preset,
                          text: v.preset,
                          value: v.preset,
                        });
                      }

                      return acc;
                    }, [])}
                  />
                </div>
                <p>{`${moment(parseInt(data.video.createdAt)).fromNow()}`}</p>
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
                  <Link to={`/users/${data.video.user.id}`}>
                    <img
                      alt=''
                      width={50}
                      height={50}
                      src={data.video.user.avatar}
                      style={{
                        borderRadius: '50%',
                        cursor: 'pointer',
                      }}
                    />
                  </Link>
                </div>
                <div style={{ height: '100%' }}>
                  <Link
                    to={`/users/${data.video.user.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      height: '50%',
                    }}>
                    {data.video.user.userName}
                  </Link>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      height: '50%',
                    }}></div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoWrapper() {
  const { id } = useParams();
  const { data } = useQuery(QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: { id },
  });

  return (
    <div>
      {data ? (
        <Video data={data} />
      ) : (
        <Loader active inline='centered' style={{ marginTop: '30px' }} />
      )}
    </div>
  );
}

export default VideoWrapper;
