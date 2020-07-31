import qs from 'qs';
import userPool from '../lib/userPool';

import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Box, Input, Button, Typography, Container } from '@material-ui/core';

function Confirm() {
  const { username } = qs.parse(window.location.search.substring(1));
  const history = useHistory();
  const [code, setCode] = useState('');

  const confirmUser = () => {
    const cognitoUser = new CognitoUser({
      Pool: userPool,
      Username: username,
    });

    cognitoUser.confirmRegistration(code, true, err => {
      if (err) return alert(err.message || JSON.stringify(err));
      history.push(`/login`);
    });
  };

  if (!username) {
    return (
      <Box style={{ padding: 30 }} display='flex' justifyContent='center'>
        <Typography variant='body1'>Invalid username</Typography>
      </Box>
    );
  } else {
    return (
      <Container maxWidth='xs'>
        <Box display='flex' flexDirection='column'>
          <Box p={1}>
            <Typography variant='h4'>Hey {username}!</Typography>
          </Box>
          <Box p={1}>
            <Input
              fullWidth
              value={code}
              placeholder='Please enter your welcome code'
              onChange={e => setCode(e.target.value)}
            />
          </Box>
          <Box p={1}>
            <Button variant='outlined' fullWidth onClick={confirmUser}>
              Confirm
            </Button>
            <Box style={{ padding: 30 }} display='flex' justifyContent='center'>
              <Link to='/reset/code'>Request a new code</Link>
            </Box>
            <Typography variant='body1'></Typography>
          </Box>
        </Box>
      </Container>
    );
  }
}

export default Confirm;
