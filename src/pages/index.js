import { Heading, Spinner, Pane, } from 'evergreen-ui';
import React from 'react';
import Layout from '../components/Layout';
import { useApi, } from '../utils/api';
import VideoGrid from '../components/VideoGrid';

function index() {
  const { data } = useApi('/videos');

  if (data) {
    return (
      <Layout>
        <Pane padding={10}>
          <Heading size={700}> Latest Videos </Heading>
        </Pane>
        <Pane padding={10}>
          {data && <VideoGrid videos={data} />}
        </Pane>
      </Layout>
    );
  }

  return (
    <Layout>
      <Pane padding={10} display='flex' justifyContent='center'>
        <Spinner />
      </Pane>
    </Layout>
  );
}

export default index;