import moment from 'moment';
import qs from 'query-string';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import {
  Select,
  MenuItem,
  Container,
  InputLabel,
  Typography,
  FormControl,
  LinearProgress,
  CircularProgress,
} from '@material-ui/core';

const Wrapper = styled.div`
  margin: 0px;
  line-height: 0px;
  overflow: hidden;
  background-color: #000000;
  height: calc(100vh - 300px);
  maxHeight: calc((9 /  16) * 100vw);
`

const QUERY = gql`
  query getVideo($id: String!) {
    video(id: $id) {
      id
      title
      views
      visibility
      createdAt
      user {
        id
        avatar
        username
      }
      tidal {
        versions {
          link
          status
          preset
        }
      }
    }
  }
`;

const pickUrl = (versions, override) => {
  console.log('pickUrl versions', versions);

  if (versions) {
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
  }
};

function Video({ data }) {
  useEffect(() => {
    const { t } = qs.parse(window.location.search);
    if (t) {
      const video = document.getElementById('bkenVideoPlayer');
      video.currentTime = t
    }
  }, [])

  const [version, setVersion] = useState(pickUrl(data.video.tidal.versions));

  if (version) {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          <div>
            <Wrapper>
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
            </Wrapper>
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
                    <Typography variant='h4'>{data.video.title}</Typography>
                    <FormControl>
                      <InputLabel id='quality-selector'>Quality</InputLabel>
                      <Select
                        labelId='quality-selector'
                        id='demo-simple-select'
                        value={version}
                        onChange={e => {
                          const video = document.getElementById('bkenVideoPlayer');
                          setVersion(pickUrl(data.video.tidal.versions, e.target.value.preset));
                          // WARNING :: play() request was interrupted by a new load request.
                          if (video) {
                            const currentTime = video.currentTime;
                            video.src = version.link;
                            video.play();
                            video.currentTime = currentTime;
                          }
                        }}>
                        {data.video.tidal.versions.map(v => {
                          if (v.link) {
                            return (
                              <MenuItem key={v.preset} value={v}>
                                {v.preset.split('-')[1]}
                              </MenuItem>
                            );
                          }
                        })}
                      </Select>
                    </FormControl>
                  </div>
                  <Typography variant='body2'>{`${moment(
                    parseInt(data.video.createdAt),
                  ).fromNow()}`}</Typography>
                  <Typography variant='subtitle2'>{data.video.visibility}</Typography>
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
                    <Link to={`/users/${data.video.user.username}`}>
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
                      to={`/users/${data.video.user.username}`}
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
  } else {
    return <LinearProgress />;
  }
}

function VideoWrapper() {
  const { id } = useParams();
  const { data } = useQuery(QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: { id },
  });

  if (data) return <Video data={data} />;
  return <LinearProgress />;
}

export default VideoWrapper;
