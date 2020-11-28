import LinearProgress from '@material-ui/core/LinearProgress';
import { gql, useQuery, } from '@apollo/client';
import React, { useEffect, } from 'react';
import { Typography, } from '@material-ui/core';
import VideoGrid from '../components/videoGrid';

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

function Home() {
  const padding = { paddingLeft: '20px', paddingTop: '20px' };
  const { data, error, refetch } = useQuery(GET_RECENT_VIDEOS);

  useEffect(() => {
    refetch();
  }, []);

  if (error) console.log(error);
  if (data) {
    return (
      <div>
        <Typography variant='h5' style={padding}> Latest </Typography>
        <VideoGrid videos={data.getRecentVideos} />
      </div>

    );
  }
  return <LinearProgress> Loading </LinearProgress>;
}

export default Home;
