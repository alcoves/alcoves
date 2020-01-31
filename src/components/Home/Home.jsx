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
      thumbnail
      user {
        id
        displayName
        avatar
      }
    }
  }
`;

export default () => {
  const { loading, data } = useQuery(GET_VIDEOS);

  if (loading) {
    return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
  }

  if (data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <VideoGrid videos={data.videos} />
      </div>
    );
  }
};
