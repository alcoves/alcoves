import '../styles/index.css';
import Head from 'next/head';
import { Grommet, } from 'grommet';
import React from 'react';
import LogRocket  from 'logrocket';
import setupLogRocketReact  from 'logrocket-react';
import Bugsnag from '../utils/bugsnag';
import theme from '../styles/theme';
import { Provider, } from '../utils/store';

function App({ Component, pageProps }) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    LogRocket.init('7qbcw4/bkenio');
    setupLogRocketReact(LogRocket);
  }

  if (process.env.NODE_ENV === 'production') {
    const ErrorBoundary = Bugsnag.getPlugin('react');
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

  return (
    <>
      <Head>
        <title>bken.io</title>
      </Head>
      <Grommet full theme={theme} themeMode='dark'>
        <Provider>
          <Component {...pageProps} />
        </Provider>
      </Grommet>
    </>
  );
}

export default App;
