import User from '../../data/User';
import LoginAction from './LoginAction';
import React, { useContext } from 'react';

import { useHistory, Redirect } from 'react-router-dom';
import { Button, Form, Grid } from 'semantic-ui-react';
import { observer, useObservable } from 'mobx-react-lite';

export default observer(() => {
  const user = useContext(User);
  const history = useHistory();
  const state = useObservable({
    email: '',
    password: '',
    buttonClicked: false,
  });

  const handleChange = (e, { name, value }) => {
    state[name] = value;
  };

  if (user.isLoggedIn()) return <Redirect to='/account' />;

  if (state.buttonClicked) {
    return <LoginAction {...state} email={state.email} password={state.password} />;
  }

  return (
    <Grid textAlign='center' style={{ marginTop: '50px' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Form size='large' onSubmit={() => (state.buttonClicked = true)}>
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
              <Button
                basic
                fluid
                color='teal'
                content='Or Register'
                onClick={() => history.push('/register')}
              />
            </Grid.Column>
          </Grid>
        </Form>
      </Grid.Column>
    </Grid>
  );
});
