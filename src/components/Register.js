import register from '../gql/register';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

export default function Register() {
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
    console.log('registered successfully, logging the user in....');
    return <div>logging you in....</div>;
  }

  return (
    <div>
      <h1> Create your account </h1>
      <input name='email' onChange={handleChange} placeholder='email' />
      <input name='username' onChange={handleChange} placeholder='username' />
      <input name='password' onChange={handleChange} placeholder='password' />
      <input name='confirmPassword' onChange={handleChange} placeholder='confirm password' />
      <button onClick={handleSubmit}> Register </button>
    </div>
  );
}
