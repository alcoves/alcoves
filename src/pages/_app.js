import 'semantic-ui-css/semantic.min.css';
import './index.css';

import React from 'react';
import { withApollo } from '../lib/apollo'
import Layout from '../components/Layout';

function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default withApollo({ ssr: true })(App)