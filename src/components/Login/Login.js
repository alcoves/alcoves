import api from '../../api/api';
import User from '../../data/User';
import React, { useContext } from 'react';

import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';

export default observer(props => {
  const user = useContext(User);
  const history = useHistory();

  const state = useObservable({
    email: '',
    password: '',
    displayName: '',
    loading: false,
  });

  const handleChange = (e, { name, value }) => {
    state[name] = value;
  };

  const handleSubmit = async () => {
    try {
      state.loading = true;
      const { data } = await api({
        method: 'post',
        url: '/login',
        data: {
          email: state.email,
          password: state.password,
        },
      });

      state.loading = false;
      user.login(data.accessToken);
      props.history.push('/');
    } catch (error) {
      console.log(error);
      state.loading = false;
    }
  };

  return (
    <Grid textAlign='center' style={{ marginTop: '50px' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon='mail'
              name='email'
              iconPosition='left'
              value={state.email}
              placeholder='E-mail address'
              onChange={handleChange}
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
                  color='teal'
                  basic
                  fluid
                  content='Or Register'
                  onClick={() => history.push('/register')}
                />
              </Grid.Column>
            </Grid>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
});
