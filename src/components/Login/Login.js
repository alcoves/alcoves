import { gql } from 'apollo-boost';
import User from '../../data/User';
import React, { useContext } from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Redirect, Link } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';
import { Button, Form, Grid, Loader } from 'semantic-ui-react';

const loginQuery = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      accessToken
    }
  }
`;

export default observer(() => {
  const user = useContext(User);
  const state = useObservable({
    email: '',
    password: '',
    buttonClicked: false,
  });

  const handleChange = (e, { name, value }) => {
    state[name] = value;
  };

  if (user.isLoggedIn()) return <Redirect to='/account' />;

  const [login, { called, loading, data, error }] = useMutation(loginQuery, {
    variables: { input: { email: state.email, password: state.password } },
  });

  if (error) {
    return <div> there was an error logging you in </div>;
  }

  if (data) {
    user.login(data.login.accessToken);
    return <Redirect to='/' />;
  }

  if (called || loading) {
    return <Loader active />;
  }

  return (
    <Grid textAlign='center' style={{ marginTop: '50px' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Form size='large' onSubmit={login}>
          <Form.Input
            fluid
            icon='mail'
            name='email'
            iconPosition='left'
            value={state.email}
            onChange={handleChange}
            placeholder='E-mail address'
          />
          <Form.Input
            fluid
            icon='lock'
            type='password'
            name='password'
            iconPosition='left'
            placeholder='Password'
            value={state.password}
            onChange={handleChange}
          />
          <Grid>
            <Grid.Column width={10}>
              <Form.Button color='teal' fluid content='Login' />
            </Grid.Column>
            <Grid.Column width={6}>
              <Button as={Link} to='/register' basic fluid color='teal' content='Or Register' />
            </Grid.Column>
          </Grid>
        </Form>
      </Grid.Column>
    </Grid>
  );
});
