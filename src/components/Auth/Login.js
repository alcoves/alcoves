import { Link, useHistory } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { CognitoContext } from '../../contexts/CognitoContext';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { Button, Container, Box, TextField, LinearProgress, Typography } from '@material-ui/core';

function Login() {
  const history = useHistory();
  const { pool, getUser } = useContext(CognitoContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localUser, setLocalUser] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = () => {
    setLoading(true);
    const cogUser = new CognitoUser({
      Pool: pool,
      Username: localUser.username,
    });

    const authDetails = new AuthenticationDetails({
      Username: localUser.username,
      Password: localUser.password,
    });

    cogUser.authenticateUser(authDetails, {
      onSuccess: async () => {
        setLoading(false);
        getUser();
        history.push('/account');
      },

      onFailure: err => {
        setError(err);
        setLoading(false);
      },
    });
  };

  const handleChange = ({ target: { id, value } }) => {
    setLocalUser(prevUser => ({
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
          value={localUser.username}
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
          value={localUser.password}
          onChange={handleChange}
        />
      </Box>
      <Box>
        <Box p={1} display='flex' flexDirection='row'>
          <Button fullWidth component={Link} to='/register' color='primary'>
            Or Register
          </Button>
          <Button fullWidth onClick={handleSubmit} color='primary' variant='contained'>
            Login
          </Button>
        </Box>
      </Box>
      <Box p={1}>{loading && <LinearProgress />}</Box>
      <Box p={1}>{error && <Typography variant='body1'>{JSON.stringify(error)}</Typography>}</Box>
    </Container>
  );
}

export default Login;
