import LinearProgress from '@material-ui/core/LinearProgress';

import { useParams, } from 'react-router-dom';
import { gql, useLazyQuery, } from '@apollo/client';
import React, { useEffect, } from 'react';
import { Typography, } from '@material-ui/core';
import styled from 'styled-components';
import VideoGrid from '../../components/videoGrid';

const GET_USER_VIDEOS = gql`
  query videosByUsername($username: String!) {
    videosByUsername(username: $username) {
      id
      title
      views
      duration
      createdAt
      thumbnails
      user {
        id
        avatar
        username
      }
    }
  }
`;

const UserBanner = styled.div`
  display: flex;
  height: 400px;
  background: #212c34;
  align-items: center;
  justify-content: center;
`;

export default function User() {
  const { username } = useParams();

  const [getVideos, {
    loading, called, data, error, refetch,
  }] = useLazyQuery(GET_USER_VIDEOS, {
    variables: { username },
  });

  if (username && !loading && !called) getVideos();

  useEffect(() => {
    if (!loading && called) refetch();
  });

  if (error) console.error(error);
  if (data && username) return (
    <div>
      <UserBanner>
        <Typography variant='h2'> 
          {username}
        </Typography>
      </UserBanner>
      <VideoGrid videos={data.videosByUsername} />
    </div>
  );
  return <LinearProgress />;
}