import React from 'react';
import { Typography, Container } from '@material-ui/core';

export default function () {
  return (
    <Container>
      <Typography variant='h3'>Check back in September</Typography>
      <Typography variant='body1'>
        We're working on critical backend maintenance. We'll be back online as soon as we're done.
      </Typography>
      <Typography varaint='body1'>Thanks for your patience.</Typography>
    </Container>
  );
}
