import moment from 'moment';
import React, { useEffect, } from 'react';
import styled from 'styled-components';
import { gql, useLazyQuery, useMutation, } from '@apollo/client';
import { Link, useParams, } from 'react-router-dom';
import {
  Container,
  Typography,
  IconButton,
  LinearProgress,
} from '@material-ui/core';
import { ThumbUpOutlined, } from '@material-ui/icons';
import VideoPlayer from '../components/VideoPlayer/index';
import abbreviateNumber from '../utils/abbreviateNumber';

function GoogleAds() {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      data-ad-format='auto'
      className='adsbygoogle'
      data-ad-slot='7992005664'
      style={{ display: 'block' }}
      data-full-width-responsive='true'
      data-ad-client='ca-pub-1017771648826122'
    />
  );
}

const SubtitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const VideoContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

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
        link
        versions {
          status
          preset
        }
      }
    }
  }
`;

const VIEW_VIDEO = gql`
  mutation viewVideo($id: String!) {
    viewVideo(id: $id)
  }
`;

function Video() {
  const { id } = useParams();
  const [getVideo, { data, called }] = useLazyQuery(QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: { id },
  });

  const [viewVideo, { called: viewVideoCalled }] = useMutation(
    VIEW_VIDEO,
    { variables: { id },
    });

  if (id && !called) getVideo();

  if (data) {
    if (!viewVideoCalled) viewVideo();

    return (
      <VideoContainerWrapper>
        <VideoPlayer link={data.video.tidal.link} />
        <Container style={{ marginTop: '20px' }}>
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant='h4'>{data.video.title}</Typography>
            </div>
            <div>
              <SubtitleContainer>
                <div>
                  <Typography variant='body2'>
                    {`${abbreviateNumber(data.video.views)} views · ${moment(Number(data.video.createdAt)).fromNow()}`}
                  </Typography>
                  <Typography variant='subtitle2'>{data.video.visibility}</Typography>
                </div>
                <div>
                  <IconButton disabled>
                    <ThumbUpOutlined />
                  </IconButton>
                </div>
              </SubtitleContainer>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: '10px',
              height: '75px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '10px',
              }}
            >
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
                }}
              >
                {data.video.user.username}
              </Link>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  height: '50%',
                }}
              />
            </div>
          </div>
        </Container>
        <GoogleAds />
      </VideoContainerWrapper>
    );
  }

  return <LinearProgress />;
}

export default Video;
