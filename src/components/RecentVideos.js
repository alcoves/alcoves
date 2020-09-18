import VideoGrid from './VideoGrid';
import LinearProgress from '@material-ui/core/LinearProgress';

import { gql, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core';

const GET_RECENT_VIDEOS = gql`
  query getRecentVideos {
    getRecentVideos {
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

function GetRecentVideos() {
  const { data, error, refetch } = useQuery(GET_RECENT_VIDEOS);

  useEffect(() => {
    refetch();
  }, []);

  if (error) console.log(error);
  if (data) return (
    <div>
      <Typography variant='h5' style={{ paddingLeft: '20px', paddingTop: '20px' }}> Latest </Typography>
      <VideoGrid videos={data.getRecentVideos} />
    </div>

  );
  return <LinearProgress> Loading </LinearProgress>;
}

export default GetRecentVideos;
