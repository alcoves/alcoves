import React from 'react';
import { gql } from 'apollo-boost';

import { useQuery } from '@apollo/react-hooks';
import { CircularProgress } from '@material-ui/core';

const GET_USER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      id
      avatar
      username
    }
  }
`;

function UserHeader() {
  const { loading, data, error } = useQuery(GET_USER, { variables: { id: history.query.id } });

  if (loading) {
    return <CircularProgress> Loading the banner... </CircularProgress>;
  }

  if (error) {
    console.log(error);
    return <div>error</div>;
  }

  if (data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '100%',
              height: '300px',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,.1) 0%, rgba(0,0,0,.7) 100%)`,
            }}>
            <div
              style={{
                width: '100%',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <h2> {data.user.username} </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserHeader;
