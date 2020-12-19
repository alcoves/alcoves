import '../styles/index.css';
import Head from 'next/head';
import { Grommet, } from 'grommet';
import React from 'react';
import Bugsnag from '../utils/bugsnag';
import theme from '../styles/theme';
import { Provider, } from '../utils/store';

const ErrorBoundary = Bugsnag.getPlugin('react');

function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Head>
        <title>bken.io</title>
      </Head>
      <Grommet full theme={theme} themeMode='dark'>
        <Provider>
          <Component {...pageProps} />
        </Provider>
      </Grommet>
    </ErrorBoundary>
  );  
}

export default App;
