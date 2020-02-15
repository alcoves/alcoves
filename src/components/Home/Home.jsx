import './Home.css';

import { gql } from 'apollo-boost';
import React from 'react';
import { Loader } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';
import VideoGrid from '../VideoGrid/VideoGrid';

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
        displayName
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
        <Loader active inline='centered' style={{ marginTop: '30px' }} />
      ) : (
        <VideoGrid videos={data.videos} />
      )}
    </div>
  );
}
