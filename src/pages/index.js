import 'regenerator-runtime/runtime';

import React from 'react';
import ReactGA from 'react-ga';
import Layout from '../components/Layout';

import { withApollo } from '../lib/apollo'

ReactGA.initialize('UA-77834417-2');

const IndexPage = () => (
  <Layout>
    <h1>Home</h1>
  </Layout>
)

export default withApollo({ ssr: true })(IndexPage)
