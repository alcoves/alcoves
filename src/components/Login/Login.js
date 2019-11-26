import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
    console.log(this.props);
  }

  handleLogin = () => {
    this.setState({ loading: true });

    login({
      email: this.state.email,
      password: this.state.password,
    })
      .then(res => {
        this.setState({ loading: false });
        this.props.stores.user.accessToken = res.data.accessToken;
        console.log(this.props.stores.user.accessToken);
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
