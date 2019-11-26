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
            style={{ marginTop: '30px' }}
            margin='normal'
            size='medium'
            fullWidth
            variant='contained'>
            Log In
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default Login;
