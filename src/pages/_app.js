import '../styles/index.css';
import React, { useEffect, } from 'react';
import Head from 'next/head';
import { Provider, } from 'next-auth/client';
import { useRouter, } from 'next/router';
import * as gtag from '../utils/gtag';
import { Chakra, } from '../styles/chakra';

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
      <Provider session={pageProps.session}>
        <Chakra cookies={pageProps.cookies}>
          <Component {...pageProps} />
        </Chakra>
      </Provider>
    </>
  );
}

export default App;
