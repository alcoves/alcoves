import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, LinearProgress, Typography, Container } from '@material-ui/core';

export default function Account() {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect, logout } = useAuth0();

  if (user) {
    return (
      <Container maxWidth='xs'>
        <Typography varient='subtitle2'>{`you are logged in as ${user.email}`}</Typography>
        <Button onClick={logout}>Logout</Button>
      </Container>
    );
  }

  return <LinearProgress />;
}
