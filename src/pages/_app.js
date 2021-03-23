import '../styles/index.css';
import React from 'react';
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { Provider } from 'next-auth/client';
import theme from '../styles/theme';

const _theme = extendTheme({ theme });

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={_theme}>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
}

export default App;
