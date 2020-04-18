import React from 'react';
import userPool from '../lib/userPool';

import { useRouter } from 'next/router';
import { Button } from 'semantic-ui-react';

function Logout() {
  const router = useRouter();

  const logout = () => {
    const user = userPool.getCurrentUser();
    if (user) user.signOut();
    router.replace('/');
  };

  return (
    <Button basic fluid color='teal' onClick={logout}>
      Logout
    </Button>
  );
}

export default Logout;
