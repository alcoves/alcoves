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
          <meta name='propeller' content='49f2d20cb1da685e9da995ccfd679789' />
        </Head>
        <body>
          <script src='https://cdn.jsdelivr.net/npm/hls.js@latest'/>
          <script src='https://cdn.dashjs.org/latest/dash.all.min.js'/>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}