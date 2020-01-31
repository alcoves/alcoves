import { gql } from 'apollo-boost';
import React, { useContext } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { Loader } from 'semantic-ui-react';
import UserStore from '../../data/User';

export default props => {
  const user = useContext(UserStore);
  const GET_USER = gql`
  {
    user(id: "${props.match.params.userId}") {
      id
      avatar
      displayName
    }
  }
`;

  const { loading, data, error } = useQuery(GET_USER);

  if (loading) {
    return <Loader active> Loading the banner... </Loader>;
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
            }}
          >
            <div
              style={{
                width: '100%',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h2> 
                {' '}
                {data.user.displayName}
                {' '}
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
