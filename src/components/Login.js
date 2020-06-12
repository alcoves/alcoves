import UserPool from '../lib/userPool';

import { useHistory, Link } from 'react-router-dom';
import React, { useState, useCallback } from 'react';
import { Button, Form, Grid, Loader, Message } from 'semantic-ui-react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

function Login() {
  const history = useHistory();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(({ currentTarget }) => {
    setLoading(true);
    const form = new FormData(currentTarget);

    const user = new CognitoUser({
      Pool: UserPool,
      Username: form.get('userName'),
    });

    const authDetails = new AuthenticationDetails({
      Username: form.get('userName'),
      Password: form.get('password'),
    });

    user.authenticateUser(authDetails, {
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
  });

  return (
    <div>
      <Grid textAlign='center' style={{ marginTop: '50px' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          {error ? <Message error header='Error while logging in' content={error} /> : null}
          {loading ? <Loader active /> : null}

          <Form size='large' onSubmit={handleSubmit}>
            <fieldset disabled={loading} style={{ border: 'none' }}>
              <Form.Input
                fluid
                icon='user'
                name='userName'
                iconPosition='left'
                placeholder='Username'
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
    </div>
  );
}

export default Login;
