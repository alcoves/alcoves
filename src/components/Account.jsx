import styled from 'styled-components';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, LinearProgress, Typography, Container } from '@material-ui/core';
import { UserContext } from '../contexts/UserContext';

const AvatarContainer = styled.div`
  display: flex;
  padding-top: 20px;
  align-items: center;
  justify-content: center;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
`;

export default function Account() {
  const history = useHistory();
  const { user, logout } = useContext(UserContext);

  if (user) {
    return (
      <Container maxWidth='xs'>
        <AvatarContainer>
          <Avatar
            src='https://s3.us-east-2.wasabisys.com/cdn.bken.io/files/default-thumbnail-sm.jpg'
            alt='avatar'
          />
        </AvatarContainer>
        <br />
        <Typography align='center' variant='subtitle1'>{`${user.username}`}</Typography>
        <Typography align='center' variant='subtitle2'>{`${user.email}`}</Typography>
        <br />
        <Button
          fullWidth
          variant='outlined'
          onClick={() => {
            logout();
            history.push('/');
          }}>
          Log Out
        </Button>
      </Container>
    );
  }

  // if (!user) return history.push('/login');
  return <LinearProgress />;
}
