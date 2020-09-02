import VideoGrid from './VideoGrid';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useParams } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const GET_USER_VIDEOS = gql`
  query videosByNickname($username: String!) {
    videosByNickname(username: $username) {
      id
      title
      views
      duration
      createdAt
      user {
        id
        avatar
        username
      }
      tidal {
        thumbnail
        versions {
          link
          status
          preset
        }
      }
    }
  }
`;

function UserVideoGrid() {
  const { user } = useContext(UserContext);
  const { username } = useParams();

  const [getVideos, { loading, called, data, error, refetch }] = useLazyQuery(GET_USER_VIDEOS, {
    variables: { username },
  });

  if (username && !loading && !called) getVideos();

  useEffect(() => {
    console.log('use effect!');
    if (!loading && called) {
      console.log('refetching...');
      refetch();
    }
  });

  if (error) console.log(error);
  if (data && username && user) return <VideoGrid videos={data.videosByNickname} />;
  return <LinearProgress> Loading user videos... </LinearProgress>;
}

export default UserVideoGrid;
