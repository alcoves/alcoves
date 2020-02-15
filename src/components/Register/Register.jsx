import { gql } from 'apollo-boost';
import User from '../../data/User';
import React, { useContext, useState, useCallback } from 'react';

import { Redirect, Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Button, Form, Grid, Loader } from 'semantic-ui-react';

const registerMutation = gql`
  mutation register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
    }
  }
`;

export default function Register() {
  const user = useContext(User);
  const [register, { called, loading, data, error }] = useMutation(registerMutation);

  const handleSubmit = useCallback(({ currentTarget }) => {
    const form = new FormData(currentTarget);

    register({
      variables: {
        input: {
          email: form.get('email'),
          password: form.get('password'),
          code: form.get('code'),
          displayName: form.get('displayName'),
        },
      },
    });
  });

  if (data) {
    user.login(data.register.accessToken);
    return <Redirect to='/' />;
  }

  return (
    <Grid textAlign='center' style={{ marginTop: '50px' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        {error ? error.graphQLErrors.map(e => <pre>{e.message}</pre>) : null}

        {called && loading ? <Loader active /> : null}

        <Form size='large' onSubmit={handleSubmit}>
          <fieldset disabled={loading} style={{ padding: 'none', border: 'none' }}>
            <Form.Input
              fluid
              icon='user'
              name='displayName'
              iconPosition='left'
              placeholder='Display Name'
            />
            <Form.Input
              fluid
              icon='mail'
              name='email'
              iconPosition='left'
              placeholder='E-mail address'
            />
            <Form.Input
              fluid
              icon='lock'
              type='password'
              name='password'
              iconPosition='left'
              placeholder='Password'
            />
            <Form.Input fluid icon='code' name='code' iconPosition='left' placeholder='Beta Code' />

            <Grid>
              <Grid.Column width={10}>
                <Form.Button color='teal' fluid content='Register' />
              </Grid.Column>
              <Grid.Column width={6}>
                <Button as={Link} to='/login' color='teal' basic fluid content='Or Login' />
              </Grid.Column>
            </Grid>
          </fieldset>
        </Form>
      </Grid.Column>
    </Grid>
  );
}
