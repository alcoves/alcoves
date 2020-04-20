import gql from 'graphql-tag';
import Router, { useRouter } from 'next/router';
import withMe from '../lib/withMe';
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
        userName
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
  const router = useRouter();
  const { me } = withMe();

  const { loading, called, data, error, refetch } = useQuery(GET_USER_VIDEOS, {
    variables: { id: router.query.id },
  });

  useEffect(() => {
    console.log('use effect!');
    if (!loading && called) {
      console.log('refetching...');
      refetch();
    }
  });

  if (error) console.log(error);
  if (data && router.query.id && me) {
    return (
      <VideoGrid videos={data.videosByUserId} isEditor={Boolean(router.query.id === me.sub)} />
    );
  }

  return <Loader active> Loading user videos... </Loader>;
}

export default UserVideoGrid;
