import React from 'react';
import withUser from '../lib/withUser';
import userPool from '../lib/userPool';

import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import userAtom from '../lib/withUser';
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from 'recoil';

export default function Logout() {
  const user = useRecoilValue(userAtom);
  const setUser = useResetRecoilState(userAtom);
  const history = useHistory();

  console.log('USER FROM LOGOUT', user);

  // const [user, setUser] = useRecoilState(withUser);
  // console.log('USER: ', user);

  const logout = () => {
    setUser(existingUser => null);
    // console.log(withUser);
    // setMe(preMe => ({
    //   ...preMe,
    //   iter: preMe.iter + 2,
    // }));
    // const user = userPool.getCurrentUser();
    // if (user) user.signOut();
    // history.push('/');
  };

  return (
    <Button fullWidth variant='outlined' onClick={logout}>
      Logout {user.email}
    </Button>
  );
}
