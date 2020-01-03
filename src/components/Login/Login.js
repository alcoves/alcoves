import api from '../../api/api';
import User from '../../data/User';
import React, { useContext } from 'react';

import { observer, useObservable } from 'mobx-react-lite';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

export default observer(props => {
  const user = useContext(User);

  const state = useObservable({
    email: '',
    password: '',
    loading: false,
  });

  const handleChange = (e, { name, value }) => {
    console.log(name, value);
    state[name] = value;
  };

  const handleSubmit = () => {
    state.loading = true;
    api({
      method: 'post',
      url: '/login',
      data: {
        email: state.email,
        password: state.password,
      },
    })
      .then(({ data }) => {
        state.loading = false;
        user.login(data.accessToken);
        props.history.push('/profile');
      })
      .catch(error => {
        console.log(error);
        state.loading = false;
      });
  };

  return (
    <Grid textAlign='center' style={{ marginTop: '50px' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
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
            <Form.Button color='teal' fluid size='large' content='Login' />
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
});

{
  /* <div
style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  marginTop: '50px',
}}>
<div>
  <Input
    id='email'
    placeholder='email address'
    value={state.email}
    onChange={handleTextField}
  />
</div>
<div>
  <Input
    id='password'
    type='password'
    placeholder='password'
    value={state.password}
    onChange={handleTextField}
  />
</div>
<div>
  <Button basic color='teal' size='small' onClick={handleLogin} disabled={state.loading}>
    Log In
  </Button>
</div>
</div> */
}
