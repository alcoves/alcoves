import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Grid
        container
        direction='column'
        justify='center'
        spacing={2}
        style={{ marginTop: '75px', border: 'yellow solid 2px' }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField fullWidth id='login-email' label='Email Address' required variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            type='password'
            id='login-password'
            label='Password'
            variant='outlined'
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Button size='medium' fullWidth variant='outlined'>
            Log In
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default Login;
