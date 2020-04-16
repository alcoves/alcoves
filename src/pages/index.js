console.log(process.env.BKEN_ENV);

import React from 'react';
import withMe from '../lib/withMe';
import withApollo from '../lib/withApollo';

import Layout from '../components/Layout';
import Navigation from '../components/Navigation';

function Index() {
  const me = withMe();
  if (me) {
    return (
      <Layout>
        <Navigation />
        <h1>Welcome {me.id}</h1>
      </Layout>
    );
  }
  return <div>loading</div>;
}

export default withApollo({ ssr: true })(Index);
