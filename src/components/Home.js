import React from 'react';
import VideoGrid from './VideoGrid';

import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { LinearProgress } from '@material-ui/core';

const GET_VIDEOS = gql`
  {
    videos {
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
    }
  }
`;

export default function Home() {
  const { loading = true, data = {}, error = {} } = useQuery(GET_VIDEOS);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {error.message ? <pre>{error.message}</pre> : null}
      {loading ? (
        <LinearProgress />
      ) : (
          <VideoGrid videos={data.videos} />
        )}
    </div>
  );
}
