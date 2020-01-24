import gql from 'graphql-tag';
import User from '../../data/User';
import React, { useContext } from 'react';

import { Loader } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

const loginQuery = gql`
  query login($input: LoginInput!) {
    login(input: $input) {
      accessToken
    }
  }
`;

export default ({ email, password }) => {
  const user = useContext(User);
  const { called, loading, data, error } = useQuery(loginQuery, {
    variables: { input: { email, password } },
  });

  if (error) {
    console.log('error', error);
    return <div> there was an error logging you in </div>;
  }

  if (data) {
    console.log('data', data);
    user.login(data.login.accessToken);
    return <Redirect to='/' />;
  }

  if (called || loading) {
    return <Loader active />;
  }
};
