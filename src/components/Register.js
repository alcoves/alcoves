import UserPool from '../lib/userPool';
import { Link, useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import {
  CircularProgress,
  LinearProgress,
  TextField,
  Button,
  Box,
  Container,
  Typography,
} from '@material-ui/core';

function Register() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  });

  const handleSubmit = () => {
    setLoading(true);

    const attributeEmail = new CognitoUserAttribute({
      Name: 'email',
      Value: user.email,
    });
    const attributeNickname = new CognitoUserAttribute({
      Name: 'nickname',
      Value: user.username,
    });

    UserPool.signUp(
      user.username,
      user.confirmPassword,
      [attributeEmail, attributeNickname],
      null,
      (err, data) => {
        setLoading(false);
        if (err) return setError(err.message || JSON.stringify(err));
        history.push(`/confirm?username=${user.username}`);
      },
    );
  };

  const handleChange = ({ target: { id, value } }) => {
    if (id === 'email') value = value.toLowerCase();
    setUser(prevUser => ({
      ...prevUser,
      [id]: value,
    }));
  };

  const validateInputs = () => {
    if (
      user.username &&
      user.email &&
      user.password &&
      user.confirmPassword &&
      user.password === user.confirmPassword
    ) {
      return false;
    }
    return true;
  };

  return (
    <Container size='xs' style={{ width: 400 }}>
      <Box>
        <Box p={1}>
          <TextField
            fullWidth
            size='small'
            id='username'
            label='Username'
            onChange={handleChange}
            value={user.username}
          />
        </Box>
        <Box p={1}>
          <TextField
            fullWidth
            size='small'
            id='email'
            label='Email'
            onChange={handleChange}
            value={user.email}
          />
        </Box>
        <Box p={1}>
          <TextField
            fullWidth
            size='small'
            id='password'
            label='Password'
            type='password'
            onChange={handleChange}
            value={user.password}
          />
        </Box>
        <Box p={1}>
          <TextField
            fullWidth
            size='small'
            type='password'
            id='confirmPassword'
            label='Confirm Password'
            onChange={handleChange}
            value={user.confirmPassword}
          />
        </Box>
      </Box>
      <Box p={1}>
        <Typography variant='body1'>Password must have numbers</Typography>
        <Typography variant='body1'>Password must special character</Typography>
        <Typography variant='body1'>Password must uppercase letters</Typography>
        <Typography variant='body1'>Password must lowercase letters</Typography>
      </Box>
      <Box p={1} display='flex' flexDirection='row'>
        <Button fullWidth component={Link} to='/login' color='primary'>
          Or Login
        </Button>
        <Button
          fullWidth
          disabled={validateInputs()}
          onClick={handleSubmit}
          color='primary'
          variant='contained'>
          Register
        </Button>
      </Box>
      <Box p={1}>{loading && <LinearProgress />}</Box>
      <Box p={1}>
        {error ? <Typography variant='body1'>{JSON.stringify(error)}</Typography> : null}
      </Box>
    </Container>
  );
}

export default Register;
