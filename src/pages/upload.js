import React from 'react';
import withApollo from '../lib/withApollo';

import Layout from '../components/Layout';
import Uploader from '../components/Uploader';
import Navigation from '../components/Navigation';

function Upload() {
  return (
    <Layout>
      <Navigation />
      <Uploader />
    </Layout>
  );
}

export default withApollo({ ssr: false })(Upload);
