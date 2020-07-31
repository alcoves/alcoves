import UserPool from '../lib/userPool';

import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Container, TextField, Grid, Button, Typography } from '@material-ui/core';

export default function ResendActivationCode() {
  const [email, setEmail] = useState('');

  function handleSubmit() {
    const cognitoUser = new CognitoUser({
      Pool: UserPool,
      Username: email,
    });

    cognitoUser.resendConfirmationCode(function (err, result) {
      if (err) return alert(err.message || JSON.stringify(err));
    });
  }

  return (
    <Container style={{ width: 400, marginTop: '30px' }}>
      <Typography variant='subtitle1'>Resend Activation Code</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={10}>
          <TextField
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
            fullWidth
            placeholder='email'
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button fullWidth onClick={handleSubmit}>
            Send
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
