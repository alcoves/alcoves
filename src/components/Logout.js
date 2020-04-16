import React from 'react';
import gql from 'graphql-tag';

import { Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';

const LOGOUT = gql`
  mutation logout {
    logout {
      success
    }
  }
`;

function Logout() {
  const [logout, { loading, data, called, error }] = useMutation(LOGOUT);

  if (data && called && !loading && !error) {
    window.location.href = '/';
  }

  return (
    <Button basic fluid color='teal' loading={loading} onClick={() => logout()}>
      Logout
    </Button>
  );
}

export default Logout;
