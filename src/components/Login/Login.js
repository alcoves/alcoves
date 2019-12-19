import React, { useContext } from 'react';

import User from '../../data/User';
import { Button, Input, message, Row, Col } from 'antd';

import { login } from '../../api/api';
import { observer, useObservable } from 'mobx-react-lite';

export default observer(props => {
  const user = useContext(User);

  const state = useObservable({
    email: '',
    password: '',
    loading: false,
  });

  const handleTextField = e => {
    state[e.target.id] = e.target.value;
  };

  const handleLogin = () => {
    state.loading = true;

    login({
      email: state.email,
      password: state.password,
    })
      .then(({ data }) => {
        state.loading = false;
        user.login(data.accessToken);
        props.history.push('/profile');
      })
      .catch(err => {
        state.loading = false;
        console.log(err);
        message.error('There was an error logging you in');
      });
  };

  return (
    <div>
      <Row align='center' type='flex'>
        <Col span={8} style={{ margin: '10px' }}>
          <Input
            id='email'
            size='large'
            placeholder='email address'
            value={state.email}
            onChange={handleTextField}
          />
        </Col>
      </Row>
      <Row align='center' type='flex'>
        <Col span={8} style={{ margin: '10px' }}>
          <Input.Password
            size='large'
            id='password'
            placeholder='password'
            value={state.password}
            onChange={handleTextField}
          />
        </Col>
      </Row>
      <Row align='center' type='flex'>
        <Col span={8} style={{ margin: '10px' }}>
          <Button block onClick={handleLogin} disabled={state.loading}>
            Log In
          </Button>
        </Col>
      </Row>
    </div>
  );
});
