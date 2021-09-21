import React from 'react'
import { ColorModeScript } from '@chakra-ui/react'
// eslint-disable-next-line
import Document, { Html, Head, Main, NextScript } from 'next/document'
import theme from '../styles/theme'

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <script async src='https://www.googletagmanager.com/gtag/js?id=G-ETPYPF2X0K' />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ETPYPF2X0K', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          <link rel='shortcut icon' href='./favicon.ico' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            href='https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800&display=swap'
            rel='stylesheet'
          />
          <meta name='version' content='%REACT_APP_GIT_SHA%' />
        </Head>
        <body>
          <script async src='//cdn.jsdelivr.net/npm/hls.js@latest' />
          <script async src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js' />
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
