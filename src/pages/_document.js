import React from 'react';
import { extractStyles, } from 'evergreen-ui';
import Document, { Html, Head, Main, NextScript, } from 'next/document';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const page = renderPage();
    const { css, hydrationScript } = extractStyles();
    return {
      ...page,
      css,
      hydrationScript,
    };
  }

  render() {
    const { css, hydrationScript } = this.props;

    return (
      <Html lang='en'>
        <Head>
          <link rel='shortcut icon' href='./favicon.ico' />
          <style dangerouslySetInnerHTML={{ __html: css }} />
          <meta name='version' content='%REACT_APP_GIT_SHA%' />
          <meta property='og:title' content='bken.io' />
          <meta property='og:url' content='https://bken.io' />
          <meta property='og:image' content='./favicon.ico' />
          <meta property='og:description' content='bken.io is a video sharing platform' />
        </Head>
        <body>
          <script src='https://cdn.jsdelivr.net/npm/hls.js@latest' />
          <Main />
          {hydrationScript}
          <NextScript />
        </body>
      </Html>
    );
  }
}