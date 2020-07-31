import React from 'react';

import { Container, Typography } from '@material-ui/core';

export default function Home() {
  return (
    <Container style={{ paddingTop: '20px' }}>
      <Typography variant='h2' gutterBottom>
        Welcome
      </Typography>
      <Typography variant='body1' gutterBottom>
        bken.io is an open source video sharing platform.
      </Typography>
      <Typography variant='body1' gutterBottom>
        We're still in alpha. Expect more by the end of 2020
      </Typography>
    </Container>
  );
}
