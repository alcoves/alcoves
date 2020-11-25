import React, { useContext, useEffect, } from 'react';
import { useHistory, } from 'react-router-dom';
import { Button, LinearProgress, Typography, Container, } from '@material-ui/core';
import { useLazyQuery, } from '@apollo/client';
import AccountAvatar from './AccountAvatar';
import { UserContext, } from '../contexts/UserContext';
import getUser from '../gql/getUser';
import AccountStats from './AccountStats';

export default function Account() {
  const history = useHistory();
  const { user, logout } = useContext(UserContext);
  const [getMe, { data, error, called }] = useLazyQuery(getUser);

  useEffect(() => {
    if (user && user.id) {
      getMe({ variables: { id: user.id } });
    }
  }, [user]);

  if (user && data) {
    return (
      <Container maxWidth='xs'>
        <AccountAvatar avatar={data.me.avatar} />
        <br />
        <Typography align='center' variant='subtitle1'>{`${user.username}`}</Typography>
        <Typography align='center' variant='subtitle2'>{`${user.email}`}</Typography>
        <br />
        <AccountStats
          totalViews={data.me.totalViews}
          totalVideos={data.me.totalVideos}
        />
        <br />
        <Button
          fullWidth
          variant='outlined'
          onClick={() => {
            logout();
            history.push('/');
          }}
        >
          Log Out
        </Button>
      </Container>
    );
  }

  if (error) console.error(error);
  if (!user && called) return <Typography variant='h3'> Please log in </Typography>;
  return <LinearProgress />;
}
