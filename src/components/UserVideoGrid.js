import VideoGrid from './VideoGrid';
import LinearProgress from '@material-ui/core/LinearProgress';

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { gql, useLazyQuery } from '@apollo/client';

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
  const { user } = useAuth0();
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
