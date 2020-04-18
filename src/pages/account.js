import React from 'react';
import withMe from '../lib/withMe';
import Layout from '../components/Layout';
import Logout from '../components/Logout';
import Navigation from '../components/Navigation';

function AccountWrapper() {
  const { loading, me } = withMe();

  if (loading) {
    return (
      <Layout>
        <Navigation />
        <h1>Loading</h1>
      </Layout>
    );
  }

  if (me) {
    return (
      <Layout>
        <Navigation />
        <div> you are logged in as {me.email}</div>
        <Logout />
      </Layout>
    );
  }
}

export default AccountWrapper;
