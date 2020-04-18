import Link from 'next/link';
import UserPool from '../lib/userPool';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';

import { useRouter } from 'next/router';
import React, { useState, useCallback } from 'react';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Button, Form, Grid, Loader, Message } from 'semantic-ui-react';

function Login() {
  const router = useRouter();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(({ currentTarget }) => {
    setLoading(true);
    const form = new FormData(currentTarget);

    const username = form.get('username');
    const password = form.get('password');

    const email = form.get('email').toLowerCase();
    const attributeEmail = new CognitoUserAttribute({ Name: 'email', Value: email });

    UserPool.signUp(username, password, [attributeEmail], null, (err, data) => {
      setLoading(false);
      if (err) return setError(err.message || JSON.stringify(err));
      router.push(`/confirm?username=${username}`);
    });
  });

  return (
    <div>
      <Layout>
        <Navigation />
        <Grid textAlign='center' style={{ marginTop: '50px' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            {error ? <Message error header='Error while registering' content={error} /> : null}
            {loading ? <Loader active /> : null}

            <Form size='large' onSubmit={handleSubmit}>
              <fieldset disabled={loading} style={{ border: 'none' }}>
                <Form.Input
                  fluid
                  icon='user'
                  name='username'
                  iconPosition='left'
                  placeholder='Username'
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
                <Grid>
                  <Grid.Column width={10}>
                    <Form.Button color='teal' fluid content='Register' />
                  </Grid.Column>
                  <Grid.Column width={6}>
                    <Link href='/login'>
                      <Button as='a' to='/login' basic fluid color='teal' content='Or Login' />
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
