import React from 'react';

import Layout from '../components/Layout';
import Navigation from '../components/Navigation';

import withMe from '../lib/withMe';
import withApollo from '../lib/withApollo';

function Index() {
  const me = withMe()
  console.log('me', me);

  if (me) {
    return (
      <Layout>
        <Navigation />
        <h1>Welcome {me.id}</h1>
      </Layout>
    )
  }

  return <div>loading</div>
}

export default withApollo({ ssr: true })(Index)