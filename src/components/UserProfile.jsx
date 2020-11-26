import LinearProgress from '@material-ui/core/LinearProgress';

import { useParams, } from 'react-router-dom';
import { gql, useLazyQuery, } from '@apollo/client';
import React, { useEffect, useContext, } from 'react';
import { Typography, } from '@material-ui/core';
import VideoGrid from './VideoGrid';
import { UserContext, } from '../contexts/UserContext';

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

function UserVideoGrid() {
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', background: '#212c34' }}>
        <Typography variant='h2'>
          {username}
        </Typography>
      </div>
      <VideoGrid videos={data.videosByUsername} />
    </div>
 
  );
  return <LinearProgress />;
}

export default UserVideoGrid;
