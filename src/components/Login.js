import login from '../gql/login';
import styled from 'styled-components';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Typography, Button, TextField, Container } from '@material-ui/core';

const Spacer = styled.div`
  margin: 10px 0px 10px 0px;
`;

export default function Register() {
  const [state, setState] = useState({
    username: '',
    password: '',
  });

  const [registerQuery, { loading, error }] = useMutation(login);

  function handleChange({ target: { value, name } }) {
    setState({
      ...state,
      [name]: value,
    });
  }

  function handleSubmit() {
    registerQuery({
      variables: {
        input: {
          username: state.username,
          password: state.password,
        },
      },
    });
  }

  if (loading) {
    return <div>logging you in....</div>;
  }

  return (
    <Container maxWidth='xs' style={{ paddingTop: '20px' }}>
      <Typography variant='h3'>Login</Typography>
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
        type='password'
        name='password'
        variant='outlined'
        placeholder='password'
        onChange={handleChange}
      />
      <Spacer />
      <Button fullWidth onClick={handleSubmit} variant='contained'>
        Login
      </Button>
      <Spacer />
      {error && <Typography variant='body'>{JSON.stringify(error)} </Typography>}
    </Container>
  );
}
