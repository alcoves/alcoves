import React from 'react';
import { Box, Heading, } from 'grommet';

export default function Footer() {
  const gitSha = process.env.REACT_APP_GIT_SHA;
  const webLink = `https://github.com/bken-io/web/commit/${gitSha}`;
  const message = `Version: ${gitSha}`;
  return (
    <Box
      height='50px'
      width='100%'
      align='center'
      direction='row'
      justify='center'
    >
      <Heading level='6'>
        <a href={webLink}>
          {message}
        </a>
      </Heading>
    </Box>
  );
}