import gql from 'graphql-tag';
import Router from 'next/router';
import VideoGrid from './VideoGrid';

import React, { useEffect } from 'react';
import { Loader } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';

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
        displayName
      }
      versions {
        link
        status
        preset
      }
    }
  }
`;

export default ({ me }) => {
  const { loading, called, data, error, refetch } = useQuery(GET_USER_VIDEOS, {
    variables: { id: Router.query.id },
  });

  useEffect(() => {
    console.log('use effect!');
    if (!loading && called) {
      console.log('refetching...');
      refetch();
    }
  });

  if (error) console.log(error);
  if (data) {
    return <VideoGrid videos={data.videosByUserId} isEditor={Boolean(Router.query.id === me.id)} />;
  }

  return <Loader active> Loading user videos... </Loader>;
};
