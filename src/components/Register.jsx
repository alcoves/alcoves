import styled from 'styled-components';
import React, { useState, } from 'react';
import { Link, useHistory, } from 'react-router-dom';
import { useMutation, } from '@apollo/client';
import {
  Typography, Button, TextField, Container,
} from '@material-ui/core';
import register from '../gql/register';

const Spacer = styled.div`
  margin: 10px 0px 10px 0px;
`;

export default function Register() {
  const history = useHistory();
  const [state, setState] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [registerQuery, { loading, data, error }] = useMutation(register);

  function handleChange({ target: { value, name } }) {
    setState({
      ...state,
      [name]: value,
    });
  }

  function handleSubmit() {
    console.log('registering user', state);
    registerQuery({
      variables: {
        input: {
          email: state.email,
          username: state.username,
          password: state.confirmPassword,
        },
      },
    });
  }

  if (error) {
    return (
      <div>
        <p>there was an error</p>
        <code>{JSON.stringify(error)}</code>
      </div>
    );
  }

  if (loading) {
    return <div>registering user...</div>;
  }

  if (data) {
    history.push(`/confirm?username=${state.username}`);
    return <div />;
  }

  return (
    <Container maxWidth='xs' style={{ paddingTop: '20px' }}>
      <Typography variant='h3'>Register</Typography>
      <Link to='/login'>Or Login</Link>
      <Spacer />
      <TextField
        fullWidth
        size='small'
        name='username'
        variant='outlined'
        placeholder='username'
        onChange={handleChange}
      />
      <Spacer />
      <TextField
        fullWidth
        size='small'
        name='email'
        variant='outlined'
        placeholder='email'
        onChange={handleChange}
      />
      <Spacer />
      <TextField
        fullWidth
        size='small'
        name='password'
        type='password'
        variant='outlined'
        placeholder='password'
        onChange={handleChange}
      />
      <Spacer />
      <TextField
        fullWidth
        size='small'
        type='password'
        variant='outlined'
        name='confirmPassword'
        onChange={handleChange}
        placeholder='confirm password'
      />
      <Spacer />
      <Button fullWidth onClick={handleSubmit} variant='contained' color='primary'>
        Register
      </Button>
      <Spacer />
      {error && (
        <Typography variant='body'>
          {JSON.stringify(error)}
        </Typography>
      )}
    </Container>
  );
}
