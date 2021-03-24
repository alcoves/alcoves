import { Flex, Link } from '@chakra-ui/layout';
import React from 'react';

export default function Footer() {
  const gitSha = process.env.REACT_APP_GIT_SHA;
  const webLink = `https://github.com/bken-io/web/commit/${gitSha}`;
  const message = `Version: ${gitSha}`;
  return (
    <Flex h='50px' w='100%' justify='center' align='center'>
      <Link fontSize='xs' fontWeight='bold' href={webLink}>{message}</Link>
    </Flex>
  );
}