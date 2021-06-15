import '../styles/index.css';
import React from 'react';
import Head from 'next/head';
import { ChakraProvider, extendTheme, } from '@chakra-ui/react';
import { Provider, } from 'next-auth/client';
import theme from '../styles/theme';

const _theme = extendTheme({ theme });

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'/>
      </Head>
      <ChakraProvider theme={_theme}>
        <Provider session={pageProps.session}>
          <Component {...pageProps} />
        </Provider>
      </ChakraProvider>
    </>
  );
}

export default App;
