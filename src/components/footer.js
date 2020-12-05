import React from 'react';
import { Heading, Pane, } from 'evergreen-ui';



export default function Footer() {
  const gitSha = process.env.REACT_APP_GIT_SHA;
  const webLink = `https://github.com/bken-io/web/commit/${gitSha}`;
  const message = `Version: ${gitSha}`;
  return (
    <Pane
      height={50}
      width='100%'
      display='flex'
      alignItems='center'
      justifyContent='center'
    >
      <Heading size={100}>
        <a href={webLink}>
          {message}
        </a>
      </Heading>
    </Pane>
  );
}