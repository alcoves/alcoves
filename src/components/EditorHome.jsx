import LinearProgress from '@material-ui/core/LinearProgress';

import { gql, useLazyQuery, } from '@apollo/client';
import React, { useEffect, useContext, } from 'react';
import { Typography, } from '@material-ui/core';
import VideoGrid from './VideoGrid';
import { UserContext, } from '../contexts/UserContext';

const MY_VIDEOS = gql`
  query myVideos {
    myVideos {
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

function MyVideos() {
  const { user } = useContext(UserContext);

  const [getVideos, {
    loading, called, data, error, refetch,
  }] = useLazyQuery(MY_VIDEOS);

  if (user && !loading && !called) getVideos();

  useEffect(() => {
    if (!loading && called) refetch();
  });

  if (error) {
    console.error(error);
    return (
      <div>
        {JSON.stringify(error)}
      </div>
    );
  }
  
  if (data && user) return (
    <div>
      <div style={{ margin: '25px 25px 0px 25px' }}>
        <Typography variant='h5'>
          Video Editor
        </Typography>
        <Typography variant='body1'>
          {`This page shows your unlisted and public videos. Other users are not
          able to see this view, it's just for you.`}
        </Typography>
      </div>
      <VideoGrid videos={data.myVideos} />
    </div>
  );
  return <LinearProgress />;
}

export default MyVideos;
