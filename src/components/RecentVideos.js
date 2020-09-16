import VideoGrid from './VideoGrid';
import LinearProgress from '@material-ui/core/LinearProgress';

import { gql, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';

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
  if (data) return <VideoGrid videos={data.getRecentVideos} />;
  return <LinearProgress> Loading </LinearProgress>;
}

export default GetRecentVideos;
