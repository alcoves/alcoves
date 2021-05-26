import { Flex, Link, } from '@chakra-ui/react';
import React from 'react';

export default function Footer() {
  const gitSha = process.env.REACT_APP_GIT_SHA;
  const webLink = `https://github.com/bken-io/web/commit/${gitSha}`;
  const message = `Version: ${gitSha}`;
  return (
    <Flex h='48px' w='100%' justify='center' align='center'>
      {gitSha && <Link fontSize='xs' fontWeight='bold' href={webLink}>{message}</Link>}
    </Flex>
  );
}