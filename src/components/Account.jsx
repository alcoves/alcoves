import React, { useContext, } from 'react';
import { useHistory, } from 'react-router-dom';
import { Button, LinearProgress, Typography, Container, } from '@material-ui/core';
import { UserContext, } from '../contexts/UserContext';

export default function Account() {
  const history = useHistory();
  const { user, logout } = useContext(UserContext);

  if (user) {
    return (
      <Container maxWidth='xs'>
        <Typography varient='subtitle2'>{`you are logged in as ${user.email}`}</Typography>
        <Button
          onClick={() => {
            logout();
            history.push('/');
          }}
        >
          Sign Out
        </Button>
      </Container>
    );
  }

  if (!user) return history.push('/login');
  return <LinearProgress />;
}
