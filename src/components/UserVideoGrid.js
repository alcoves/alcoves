import VideoGrid from './VideoGrid';
import userAtom from '../lib/withUser';

import { gql } from 'apollo-boost';
import { useRecoilValue } from 'recoil';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';
import { CircularProgress } from '@material-ui/core';

const GET_USER_VIDEOS = gql`
  query videosByUsername($username: String!) {
    videosByUsername(username: $username) {
      id
      title
      views
      duration
      thumbnail
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
  return <CircularProgress> Loading user videos... </CircularProgress>;
}

export default UserVideoGrid;
