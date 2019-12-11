import jwt from 'jsonwebtoken';
import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import UserStore from '../../data/User';
import { message } from 'antd';

import { login } from '../../api/api';
import { observer, useObservable } from 'mobx-react-lite';

export default observer(props => {
  const { user } = useContext(UserStore);
  // console.log(user);

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
      .then(res => {
        state.loading = false;
        props.cookies.set('accessToken', res.data.accessToken);

        const { payload } = jwt.decode(res.data.accessToken, {
          complete: true,
        });

        user.id = payload.userId;
        user.email = payload.email;
        props.history.push('/profile');
      })
      .catch(err => {
        state.loading = false;
        console.log(err);
        message.error('There was an error logging you in');
      });
  };

  return (
    <Grid
      container
      justify="center"
      direction="column"
      alignItems="center"
      style={{ marginTop: '75px' }}>
      <Grid item xs={11} sm={8} md={5} lg={3}>
        <TextField
          required
          fullWidth
          id="email"
          margin="dense"
          variant="outlined"
          label="Email Address"
          value={state.email}
          onChange={handleTextField}
        />
        <TextField
          required
          fullWidth
          id="password"
          margin="dense"
          type="password"
          label="Password"
          variant="outlined"
          value={state.password}
          onChange={handleTextField}
        />
        <Button
          fullWidth
          margin="normal"
          size="medium"
          variant="contained"
          onClick={handleLogin}
          disabled={state.loading}
          style={{ marginTop: '30px' }}>
          Log In
        </Button>
      </Grid>
    </Grid>
  );
});
