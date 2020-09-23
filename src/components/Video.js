import moment from 'moment';

import styled from 'styled-components';
import VideoPlayer from './VideoPlayer';
import React from 'react';

import { gql, useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  LinearProgress,
} from '@material-ui/core';

const Wrapper = styled.div`
  margin: 0px;
  line-height: 0px;
  overflow: hidden;
  background-color: #000000;
  height: calc(100vh - 300px);
  max-height: calc((9 /  16) * 100vw);
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

function Video({ data }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        <div>
          <VideoPlayer
            versions={data.video.tidal.versions}
          />
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
