import api from '../../api/api';
import User from '../../data/User';
import React, { useContext } from 'react';

import { Button } from 'semantic-ui-react';
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
    <div>
      <div
        xs={22}
        md={12}
        lg={8}
        xxl={5}
        style={{ margin: '50px 10px 10px 10px', maxWidth: '400px' }}>
        <input
          id='email'
          placeholder='email address'
          value={state.email}
          onChange={handleTextField}
        />
      </div>
      <div xs={22} md={12} lg={8} xxl={5} style={{ margin: '10px', maxWidth: '400px' }}>
        <input
          id='password'
          type='password'
          placeholder='password'
          value={state.password}
          onChange={handleTextField}
        />
      </div>
      <div xs={22} md={12} lg={8} xxl={5} style={{ margin: '10px', maxWidth: '400px' }}>
        <Button onClick={handleLogin} disabled={state.loading}>
          Log In
        </Button>
      </div>
    </div>
  );
});
