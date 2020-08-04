import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CognitoContext } from '../contexts/CognitoContext';
import { Button, LinearProgress, Typography, Container } from '@material-ui/core';

export default function Account() {
  const history = useHistory();
  const { loading, authenticated, user, actions } = useContext(CognitoContext);

  if (authenticated) {
    return (
      <Container maxWidth='xs'>
        <Typography varient='subtitle2'>{`you are logged in as ${user.email}`}</Typography>
        <Button
          onClick={() => {
            actions.signOut();
            history.push('/');
          }}>
          Sign Out
        </Button>
      </Container>
    );
  }

  if (!loading && !authenticated) {
    return history.push('/login');
  }

  return <LinearProgress />;
}
