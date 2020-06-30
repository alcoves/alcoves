import qs from 'qs';
import userPool from '../lib/userPool';

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Box, Input, CircularProgress, Button, Typography, Container } from '@material-ui/core';

function Confirm() {
  const { username } = qs.parse(window.location.search.substring(1));
  const history = useHistory();
  const [code, setCode] = useState('');

  const confirmUser = () => {
    const cognitoUser = new CognitoUser({
      Pool: userPool,
      Username: username,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) return alert(err.message || JSON.stringify(err));
      history.push(`/login`);
    });
  };

  if (!username) {
    return (
      <Box style={{ padding: 30 }} display='flex' justifyContent='center'>
        <CircularProgress />
      </Box>
    );
  } else {
    return (
      <Container maxWidth='xs'>
        <Box display='flex' flexDirection='column'>
          <Box p={1}>
            <Typography variant='h6'>Hey {username}!</Typography>
          </Box>
          <Box p={1}>
            <Input
              fullWidth
              value={code}
              placeholder='Please enter your welcome code'
              onChange={(e, { value }) => setCode(value)}
            />
          </Box>
          <Box p={1}>
            <Button variant='outlined' fullWidth onClick={confirmUser}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }
}

export default Confirm;
