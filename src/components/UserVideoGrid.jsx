import LinearProgress from '@material-ui/core/LinearProgress';

import { useParams, } from 'react-router-dom';
import { gql, useLazyQuery, } from '@apollo/client';
import React, { useEffect, useContext, } from 'react';
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
  if (data && username) return <VideoGrid videos={data.videosByUsername} />;
  return <LinearProgress> Loading user videos... </LinearProgress>;
}

export default UserVideoGrid;
