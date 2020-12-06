import { Heading, Pane, } from 'evergreen-ui';
import React from 'react';
import Layout from '../components/Layout';

function index() {
  return (
    <>
      <Layout>
        <Pane
          display='flex'
          justifyContent='center'
        >
          <Heading size={500}>
            We're working on some changes, check back later!
          </Heading>
        </Pane>
      </Layout>
    </>
  );
}

export default index;