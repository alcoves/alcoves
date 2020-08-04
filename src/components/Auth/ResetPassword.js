import React, { useState, useContext } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Container, TextField, Grid, Button, Typography } from '@material-ui/core';
import { CognitoContext } from '../../contexts/CognitoContext';

export default function ResetPassword() {
  const { pool } = useContext(CognitoContext);
  const [email, setEmail] = useState('');

  function handleSubmit() {
    const cognitoUser = new CognitoUser({
      Pool: pool,
      Username: email,
    });

    cognitoUser.forgotPassword({
      onSuccess: function (data) {
        // successfully initiated reset password request
        console.log('CodeDeliveryData from forgotPassword: ' + data);
      },
      onFailure: function (err) {
        alert(err.message || JSON.stringify(err));
      },
      //Optional automatic callback
      inputVerificationCode: function (data) {
        console.log('Code sent to: ' + data);
        var code = document.getElementById('code').value;
        var newPassword = document.getElementById('new_password').value;
        cognitoUser.confirmPassword(verificationCode, newPassword, {
          onSuccess() {
            console.log('Password confirmed!');
          },
          onFailure(err) {
            console.log('Password not confirmed!');
          },
        });
      },
    });
  }

  return (
    <Container style={{ width: 400, marginTop: '30px' }}>
      <Typography variant='subtitle1'>Reset Password</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
            fullWidth
            placeholder='email'
          />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth onClick={handleSubmit}>
            Send Code
          </Button>
        </Grid>
      </Grid>

      <Typography variant='subtitle1'>Enter the code</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
            fullWidth
            placeholder='code'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
            fullWidth
            placeholder='password'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
            fullWidth
            placeholder='confirm password'
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' color='primary' fullWidth onClick={handleSubmit}>
            Reset My Password
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
