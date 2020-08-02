import VideoGrid from './VideoGrid';
import userAtom from '../lib/withUser';

import LinearProgress from '@material-ui/core/LinearProgress';

import { useRecoilValue } from 'recoil';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';

const GET_USER_VIDEOS = gql`
  query videosByUsername($username: String!) {
    videosByUsername(username: $username) {
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
  const { username } = useParams();
  const user = useRecoilValue(userAtom);

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
  if (data && username && user) return <VideoGrid videos={data.videosByUsername} />;
  return <LinearProgress> Loading user videos... </LinearProgress>;
}

export default UserVideoGrid;
