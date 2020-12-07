import { Spinner, Pane, } from 'evergreen-ui';
import React from 'react';
import Layout from '../components/Layout';
import { useApi, } from '../utils/api';
import VideoGrid from '../components/VideoGrid';

function index() {
  const { data, loading } = useApi('/videos');

  return (
    <>
      <Layout>
        <Pane padding={10}>
          {loading && <Spinner />}
          {data && <VideoGrid videos={data} />}
        </Pane>
      </Layout>
    </>
  );
}

export default index;