import React from 'react';
import withMe from '../../lib/withMe';
import withApollo from '../../lib/withApollo';

import Layout from '../../components/Layout';
import UserHeader from '../../components/UserHeader';
import Navigation from '../../components/Navigation';
import UserVideoGrid from '../../components/UserVideoGrid';

function User() {
  const me = withMe();
  if (me.id) {
    return (
      <Layout>
        <Navigation />
        <UserHeader />
        <UserVideoGrid me={me} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Navigation />
    </Layout>
  );
}

export default withApollo({ ssr: false })(User);
