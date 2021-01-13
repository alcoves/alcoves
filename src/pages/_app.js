import '../styles/index.css';
import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import React from 'react';
import LogRocket  from 'logrocket';
import setupLogRocketReact  from 'logrocket-react';
import Bugsnag from '../utils/bugsnag';
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
        <Provider>
          <Component {...pageProps} />
        </Provider>
      </ErrorBoundary>
    );  
  }

  return (
    <>
      <Head>
        <title>bken.io</title>
      </Head>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default App;
