import '../styles/index.css';
import 'tailwindcss/tailwind.css';
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
          <link rel='shortcut icon' href='./favicon.ico' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap' rel='stylesheet' />
          <meta name='version' content='%REACT_APP_GIT_SHA%' />
          <meta property='og:title' content='bken.io' />
          <meta property='og:url' content='https://bken.io' />
          <meta property='og:image' content='./favicon.ico' />
          <meta property='og:description' content='bken.io is a video sharing platform' />
          <script src='https://cdn.jsdelivr.net/npm/hls.js@latest' />
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
