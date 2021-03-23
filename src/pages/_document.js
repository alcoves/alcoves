import React from 'react';
import { ColorModeScript, } from '@chakra-ui/react';
import Document, { Html, Head, Main, NextScript, } from 'next/document';
import theme from '../styles/theme';

export default class MyDocument extends Document {
  render() {
    return(
      <Html>
        <Head>
          <link rel='shortcut icon' href='./favicon.ico' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link href='https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800&display=swap' rel='stylesheet' />
          <meta name='version' content='%REACT_APP_GIT_SHA%' />
          <script src='https://cdn.jsdelivr.net/npm/hls.js@latest' />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}