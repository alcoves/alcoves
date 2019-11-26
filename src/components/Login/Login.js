import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleLogin = () => {
    this.setState({ loading: true });
    // make api request
    // add api token to localstorage
    // show logged in user state
    // update global store
  };

  render() {
    return (
      <Grid
        container
        direction='column'
        justify='center'
        alignItems='center'
        style={{ marginTop: '75px' }}>
        <Grid item xs={11} sm={8} md={5} lg={3}>
          <TextField
            margin='dense'
            fullWidth
            id='login-email'
            label='Email Address'
            required
            variant='outlined'
          />
          <TextField
            margin='dense'
            fullWidth
            type='password'
            id='login-password'
            label='Password'
            variant='outlined'
            required
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
