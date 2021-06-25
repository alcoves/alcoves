import '../styles/index.css';
import React, { useEffect, } from 'react';
import Head from 'next/head';
import { ChakraProvider, extendTheme, } from '@chakra-ui/react';
import { Provider, } from 'next-auth/client';
import { useRouter, } from 'next/router';
import theme from '../styles/theme';
import * as gtag from '../utils/gtag';

const _theme = extendTheme({ theme });

function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

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
