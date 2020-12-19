import { Heading, Box, } from 'grommet';
import React from 'react';
import Layout from '../components/Layout';
import { useApi, } from '../utils/api';
import VideoGrid from '../components/VideoGrid/Index';
import Spinner from '../components/Spinner';

function index() {
  const { data } = useApi('/videos');

  if (data) {
    return (
      <Layout>
        <Box pad='small'>
          <Heading margin='xsmall' level='2'> Latest Videos </Heading>
          {data && <VideoGrid videos={data} />}
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box pad='small' justify='center' align='center'>
        <Spinner />
      </Box>
    </Layout>
  );
}

export default index;