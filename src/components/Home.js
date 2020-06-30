import React from 'react';
import VideoGrid from './VideoGrid';

import { gql } from 'apollo-boost';
import { CircularProgress } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';

const GET_VIDEOS = gql`
  {
    videos {
      id
      title
      views
      duration
      thumbnail
      user {
        id
        userName
        avatar
      }
    }
  }
`;

export default function Home() {
  const { loading = true, data = {}, error = {} } = useQuery(GET_VIDEOS);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {error.message ? <pre>{error.message}</pre> : null}
      {loading ? (
        <CircularProgress style={{ marginTop: '30px' }} />
      ) : (
        <VideoGrid videos={data.videos} />
      )}
    </div>
  );
}
