import withMe from '../lib/withMe';
import VideoGrid from './VideoGrid';

import { gql } from 'apollo-boost';
import React, { useEffect } from 'react';
import { Loader } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';

const GET_USER_VIDEOS = gql`
  query videosByUserId($id: String!) {
    videosByUserId(id: $id) {
      id
      title
      views
      duration
      thumbnail
      user {
        id
        avatar
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
  const { id } = useParams();
  const { me } = withMe();

  const [getVideos, { loading, called, data, error, refetch }] = useLazyQuery(GET_USER_VIDEOS, {
    variables: { id },
  });

  if (id && !loading && !called) getVideos();

  useEffect(() => {
    console.log('use effect!');
    if (!loading && called) {
      console.log('refetching...');
      refetch();
    }
  });

  if (error) console.log(error);
  if (data && id && me)
    return <VideoGrid videos={data.videosByUserId} isEditor={Boolean(id === me.sub)} />;
  return <Loader active> Loading user videos... </Loader>;
}

export default UserVideoGrid;
