import React from 'react';
import gql from 'graphql-tag';

import VideoGrid from './VideoGrid';

import { Loader } from 'semantic-ui-react';
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
        username
        avatar
      }
    }
  }
`;

export default function Home() {
  const { loading = true, data = {}, error = {} } = useQuery(GET_VIDEOS);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <style jsx global>{`
        .followerMenuItem {
          display: flex;
          align-items: center;
          cursor: pointer;
          height: 40px;
          padding: 5px;
        }
        .followerMenuItem:hover {
          background-color: #272d3c;
        }
      `}</style>

      {error.message ? <pre>{error.message}</pre> : null}

      {loading ? (
        <Loader active inline='centered' style={{ marginTop: '30px' }} />
      ) : (
        <VideoGrid videos={data.videos} />
      )}
    </div>
  );
}
