import { gql } from 'apollo-boost';
import React, { useContext, useEffect, useState } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { Loader } from 'semantic-ui-react';
import VideoGrid from '../VideoGrid/VideoGrid';
import UserStore from '../../data/User';

export default props => {
  const user = useContext(UserStore);
  const GET_USER_VIDEOS = gql`
    {
      videosByUserId(id: "${props.match.params.userId}") {
        id
        title
        views
        status
        duration
        thumbnail
        user {
          id
          avatar
          displayName
        }
        files {
          link
          status
          preset
        }
      }
    }
  `;

  const { loading, called, data, error, refetch } = useQuery(GET_USER_VIDEOS);

  useEffect(() => {
    console.log('use effect!');
    if (!loading && called) {
      console.log('refetching...');
      refetch();
    }
  });

  if (loading) {
    return <Loader active> Loading user videos... </Loader>;
  }

  if (error) {
    console.log(error);
    return <div>error</div>;
  }

  if (data) {
    return (
      <VideoGrid
        videos={data.videosByUserId}
        isEditor={Boolean(props.match.params.userId === user.id)}
      />
    );
  }
};
