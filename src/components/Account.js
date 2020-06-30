import React from 'react';
import Logout from './Logout';
import withMe from '../lib/withMe';

import { CircularProgress, Typography, Container } from '@material-ui/core';

export default function Account() {
  const { loading, me } = withMe();

  if (loading) return <CircularProgress />;

  if (me) {
    return (
      <Container maxWidth='xs'>
        <Typography
          varient='subtitle2'
          style={{ margin: 10 }}>{`you are logged in as ${me.email}`}</Typography>
        <Logout />
      </Container>
    );
  }

  return <div>Error</div>;
}
