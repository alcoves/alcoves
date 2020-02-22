import { gql } from 'apollo-boost';
import User from '../../data/User';
import { useMutation } from '@apollo/react-hooks';
import { Redirect, Link } from 'react-router-dom';
import React, { useContext, useState, useCallback } from 'react';
import { Button, Form, Grid, Loader, Message } from 'semantic-ui-react';

const loginQuery = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      accessToken
    }
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const user = useContext(User);
  const [login, { called, loading, data, error }] = useMutation(loginQuery);

  const handleSubmit = useCallback(
    ({ currentTarget }) => {
      const form = new FormData(currentTarget);

      login({
        variables: {
          input: {
            password: form.get('password'),
            email: form.get('email').toLowerCase(),
          },
        },
      });
    },
    [login],
  );

  if (user.isLoggedIn()) {
    return <Redirect to='/account' />;
  }

  if (data) {
    user.login(data.login.accessToken);
    <Redirect to='/' />;
    window.location.reload();
  }

  return (
    <Grid textAlign='center' style={{ marginTop: '50px' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        {error ? (
          <Message
            error
            header='There was some errors with your submission'
            list={error.graphQLErrors.map(e => e.message)}
          />
        ) : null}

        {called && loading ? <Loader active /> : null}

        <Form size='large' onSubmit={handleSubmit}>
          <fieldset disabled={loading} style={{ padding: 'none', border: 'none' }}>
            <Form.Input
              fluid
              icon='mail'
              name='email'
              iconPosition='left'
              value={email}
              onChange={(e, { value }) => {
                setEmail(value.toLowerCase());
              }}
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

            <Grid>
              <Grid.Column width={10}>
                <Form.Button color='teal' fluid content='Login' />
              </Grid.Column>
              <Grid.Column width={6}>
                <Button as={Link} to='/register' basic fluid color='teal' content='Or Register' />
              </Grid.Column>
            </Grid>
          </fieldset>
        </Form>
      </Grid.Column>
    </Grid>
  );
}
