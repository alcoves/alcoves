import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import jwt from 'jsonwebtoken';

import UserStore from '../../data/User';

import { login } from '../../api/api';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    const { user } = useContext(UserStore);
    console.log(user);
  }

  handleLogin = () => {
    this.setState({ loading: true });

    login({
      email: this.state.email,
      password: this.state.password,
    })
      .then(res => {
        this.setState({ loading: false });
        this.props.cookies.set('accessToken', res.data.accessToken);

        const { payload } = jwt.decode(res.data.accessToken, { complete: true });

        this.props.stores.user.id = payload.userId;
        this.props.stores.user.email = payload.email;
        this.props.history.push('/profile');
      })
      .catch(err => {
        this.setState({ loading: false });
        console.log(err);
      });
  };

  handleTextField = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
      <Grid
        container
        justify='center'
        direction='column'
        alignItems='center'
        style={{ marginTop: '75px' }}>
        <Grid item xs={11} sm={8} md={5} lg={3}>
          <TextField
            required
            fullWidth
            id='email'
            margin='dense'
            variant='outlined'
            label='Email Address'
            value={this.state.email}
            onChange={this.handleTextField}
          />
          <TextField
            required
            fullWidth
            id='password'
            margin='dense'
            type='password'
            label='Password'
            variant='outlined'
            value={this.state.password}
            onChange={this.handleTextField}
          />
          <Button
            fullWidth
            margin='normal'
            size='medium'
            variant='contained'
            onClick={this.handleLogin}
            disabled={this.state.loading}
            style={{ marginTop: '30px' }}>
            Log In
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default Login;
