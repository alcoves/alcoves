import React from 'react';
import Logout from './Logout';
import userAtom from '../lib/withUser';

import { useRecoilValue } from 'recoil';
import { LinearProgress, Typography, Container } from '@material-ui/core';

export default function Account() {
  const user = useRecoilValue(userAtom);

  if (user) {
    return (
      <Container maxWidth='xs'>
        <Typography varient='subtitle2'>{`you are logged in as ${user.email}`}</Typography>
        <Logout />
      </Container>
    );
  }

  return <LinearProgress />;
}
