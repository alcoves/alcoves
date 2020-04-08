import 'semantic-ui-css/semantic.min.css';
import './index.css';

import React from 'react';
import { withApollo } from '../lib/apollo'
// ReactGA.initialize('UA-77834417-2');

function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default withApollo({ ssr: true })(App)