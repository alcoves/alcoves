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
      <Typography variant='h4' gutterBottom>
        Features
      </Typography>
      <Typography variant='subtitle1' gutterBottom>
        Parallel Encoding
      </Typography>
      <Typography variant='body1' gutterBottom>
        We've built a custom chunk based encoder that offers faster processing than others.
      </Typography>
    </Container>
  );
}
