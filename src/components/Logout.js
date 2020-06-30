import React from 'react';
import withUser from '../lib/withUser';
import userPool from '../lib/userPool';

import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import userAtom from '../lib/withUser';
import { useRecoilValue, useResetRecoilState } from 'recoil';

export default function Logout() {
  const user = useRecoilValue(userAtom);
  const resetUser = useResetRecoilState(userAtom);
  const history = useHistory();

  const logout = () => {
    resetUser(() => null);
    const cogUser = userPool.getCurrentUser();
    if (cogUser) cogUser.signOut();
    history.push('/');
  };

  return (
    <Button fullWidth variant='outlined' onClick={logout}>
      Logout
    </Button>
  );
}
