import './Home.css';

import gql from 'graphql-tag';
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
    }
  }
`;

export default () => {
  const { loading, data } = useQuery(GET_VIDEOS);

  if (loading) {
    return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
  } else if (data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <VideoGrid videos={data.videos} />
      </div>
    );
  }
};
