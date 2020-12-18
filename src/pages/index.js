import { Heading, Box, } from 'grommet';
import React from 'react';
import Layout from '../components/Layout';
import { useApi, } from '../utils/api';
import VideoGrid from '../components/VideoGrid';
import Spinner from '../components/Spinner';

function showAd() {
  if (window !== undefined) {
    window._mNHandle.queue.push(()=> {
      window._mNDetails.loadTag('836884472', '728x90', '836884472');
    });
  }
}

function index() {
  const { data } = useApi('/videos');

  if (data) {
    return (
      <Layout>
        <Box pad='small'>
          <Heading margin='xsmall' level='2'> Latest Videos </Heading>
          {data && <VideoGrid videos={data} />}
        </Box>
        <div id='836884472'>
          {showAd()}
        </div>
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