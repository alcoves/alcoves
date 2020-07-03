import moment from 'moment';
import React, { useState, useEffect } from 'react';

import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Link, useParams } from 'react-router-dom';
import { Typography, CircularProgress, Menu, MenuItem, Container } from '@material-ui/core';

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
        username
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
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const outerDivStyle = {
    margin: 0,
    lineHeight: 0,
    overflow: 'hidden',
    backgroundColor: '#000000',
    height: 'calc(100vh - 300px)',
    maxHeight: 'calc((9 / 16) * 100vw',
  };

  const [version, setVersion] = useState(pickUrl(data.video));
  console.log('version', version);

  useEffect(() => {
    const video = document.getElementById('bkenVideoPlayer');

    if (video) {
      const currentTime = video.currentTime;
      video.src = version.link;
      video.play();
      video.currentTime = currentTime;
    }
  }, [version]);

  if (version) {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={outerDivStyle}>
              {version.link ? (
                <video
                  controls
                  autoPlay
                  width='100%'
                  height='100%'
                  src={version.link}
                  id='bkenVideoPlayer'
                  type='video/mp4'></video>
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
                  <CircularProgress inline active />
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
                    <Typography variant='h6'>{data.video.title}</Typography>

                    <Menu
                      id='simple-menu'
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}>
                      <MenuItem onClick={handleClose}>Profile</MenuItem>
                      <MenuItem onClick={handleClose}>My account</MenuItem>
                      <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>

                    {/* <Dropdown
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
                            text: v.preset.split('-')[1],
                            value: v.preset,
                          });
                        }

                        return acc;
                      }, [])}
                    /> */}
                  </div>
                  <Typography variant='body2'>{`${moment(
                    parseInt(data.video.createdAt),
                  ).fromNow()}`}</Typography>
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
                      {data.video.user.username}
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

  return <CircularProgress />;
}

function VideoWrapper() {
  const { id } = useParams();
  const { data } = useQuery(QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: { id },
  });

  return <div>{data ? <Video data={data} /> : <div />}</div>;
}

export default VideoWrapper;
