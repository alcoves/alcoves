import Link from 'next/link';
import UserPool from '../lib/userPool';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';

import { useRouter } from 'next/router';
import React, { useState, useCallback } from 'react';
import { domain, secure } from '../lib/getCookieEnv';
import { Button, Form, Grid, Loader, Message } from 'semantic-ui-react';
import { CognitoUser, AuthenticationDetails, CookieStorage } from 'amazon-cognito-identity-js';

function Login() {
  const router = useRouter();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(({ currentTarget }) => {
    setLoading(true);
    const form = new FormData(currentTarget);

    const user = new CognitoUser({
      Pool: UserPool,
      Username: form.get('userName'),
      Storage: new CookieStorage({ domain, secure }),
    });

    const authDetails = new AuthenticationDetails({
      Username: form.get('userName'),
      Password: form.get('password'),
    });

    user.authenticateUser(authDetails, {
      onSuccess: data => {
        console.log('onSuccess:', data);
        router.push('/account');
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
      <Layout>
        <Navigation />
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
                    <Link href='/register'>
                      <Button
                        as='a'
                        to='/register'
                        basic
                        fluid
                        color='teal'
                        content='Or Register'
                      />
                    </Link>
                  </Grid.Column>
                </Grid>
              </fieldset>
            </Form>
          </Grid.Column>
        </Grid>
      </Layout>
    </div>
  );
}

export default Login;
