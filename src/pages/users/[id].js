import React from 'react';
import withApollo from '../../lib/withApollo';

import Layout from '../../components/Layout';
import UserHeader from '../../components/UserHeader';
import Navigation from '../../components/Navigation';
import UserVideoGrid from '../../components/UserVideoGrid';

function User() {
  return (
    <Layout>
      <Navigation />
      {/* <UserHeader /> */}
      <UserVideoGrid />
    </Layout>
  );
}

export default withApollo({ ssr: false })(User);
