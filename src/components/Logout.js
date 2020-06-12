import React from 'react';
import userPool from '../lib/userPool';

import { useHistory } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

export default function Logout() {
  const history = useHistory();

  const logout = () => {
    const user = userPool.getCurrentUser();
    if (user) user.signOut();
    history.push('/');
  };

  return (
    <Button basic fluid color='teal' onClick={logout}>
      Logout
    </Button>
  );
}
