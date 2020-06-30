import UserPool from '../lib/userPool';

import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { Button, Container, Box, TextField, LinearProgress, Typography } from '@material-ui/core';

function Login() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = () => {
    setLoading(true);
    const cogUser = new CognitoUser({
      Pool: UserPool,
      Username: user.username,
    });

    const authDetails = new AuthenticationDetails({
      Username: user.username,
      Password: user.password,
    });

    cogUser.authenticateUser(authDetails, {
      onSuccess: data => {
        console.log('onSuccess:', data);
        history.push('/account');
      },

      onFailure: err => {
        console.error('onFailure:', err);
        setError(err);
        setLoading(false);
      },
    });
  };

  const handleChange = ({ target: { id, value } }) => {
    setUser(prevUser => ({
      ...prevUser,
      [id]: value,
    }));
  };

  return (
    <Container size='xs' style={{ width: 400 }}>
      <Box p={1}>
        <TextField
          fullWidth
          size='small'
          id='username'
          label='Username'
          value={user.username}
          onChange={handleChange}
        />
      </Box>
      <Box p={1}>
        <TextField
          type='password'
          fullWidth
          size='small'
          id='password'
          label='Password'
          value={user.password}
          onChange={handleChange}
        />
      </Box>
      <Box>
        <Box p={1} display='flex' flexDirection='row'>
          <Button fullWidth onClick={handleSubmit} color='primary' variant='contained'>
            Login
          </Button>
          <Button fullWidth component={Link} to='/register' color='primary'>
            Or Register
          </Button>
        </Box>
      </Box>
      <Box p={1}>{loading && <LinearProgress />}</Box>
      <Box p={1}>{error && <Typography variant='body1'>{JSON.stringify(error)}</Typography>}</Box>
    </Container>
  );
}

export default Login;
