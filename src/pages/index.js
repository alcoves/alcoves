import React, { useEffect, } from 'react';
import useSWR from 'swr';
import { Box, Heading, } from '@chakra-ui/react';
import Layout from '../components/Layout';
import VideoGrid from '../components/VideoGrid/Index';

const fetcher = (url) => fetch(url).then((res) => res.json());

function index() {
  const { data } = useSWR('/api/videos', fetcher);

  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <Layout>
      <Box px='2'>
        <ins className='adsbygoogle'
          style={{ display:'block' }}
          data-ad-client='ca-pub-1017771648826122'
          data-ad-slot='1395737646'
          data-ad-format='auto'
          data-full-width-responsive='true' />
        <Heading py='2'> Latest Videos </Heading>
        <VideoGrid videos={data} />
      </Box>
    </Layout>
  );
}

export default index;