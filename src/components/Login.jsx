import styled from 'styled-components';
import { useMutation, } from '@apollo/client';
import React, { useState, useContext, } from 'react';
import { Link, useHistory, } from 'react-router-dom';
import {
  LinearProgress, Typography, Button, TextField, Container,
} from '@material-ui/core';
import { UserContext, } from '../contexts/UserContext';
import loginQuery from '../gql/login';

const Spacer = styled.div`
  margin: 10px 0px 10px 0px;
`;

export default function Login() {
  const { login } = useContext(UserContext);
  const history = useHistory();
  const [state, setState] = useState({
    username: '',
    password: '',
  });

  const [registerQuery, { loading, error, data }] = useMutation(loginQuery);

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

  if (loading) return <LinearProgress />;

  if (data) {
    login(data.login.token);
    history.push('/');
  }

  return (
    <Container maxWidth='xs' style={{ paddingTop: '20px' }}>
      <Typography variant='h3'>Login</Typography>
      <Link to='/register'>Or Register</Link>
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
      <Button fullWidth onClick={handleSubmit} variant='contained' color='primary'>
        Login
      </Button>
      <Spacer />
      {error && (
        <Typography variant='body1'>
          {JSON.stringify(error)}
        </Typography>
      )}
    </Container>
  );
}
