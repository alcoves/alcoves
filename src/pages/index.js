import React from 'react';
import useSWR from 'swr';
import { Box, Heading, } from '@chakra-ui/react';
import Layout from '../components/Layout';
import VideoGrid from '../components/VideoGrid/Index';

const fetcher = (url) => fetch(url).then((res) => res.json());

function index() {
  const { data } = useSWR('/api/videos', fetcher);

  return (
    <Layout>
      <Box px='2'>
        <Heading py='2'> Latest Videos </Heading>
        <VideoGrid videos={data} />
      </Box>
    </Layout>
  );
}

export default index;