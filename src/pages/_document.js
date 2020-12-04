import React from 'react';
import { extractStyles, } from 'evergreen-ui';
import Document, { Html, Head, Main, NextScript, } from 'next/document';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const page = renderPage();
    // `css` is a string with css from both glamor and ui-box.
    // No need to get the glamor css manually if you are using it elsewhere in your app.
    //
    // `hydrationScript` is a script you should render on the server.
    // It contains a stringified version of the glamor and ui-box caches.
    // Evergreen will look for that script on the client and automatically hydrate
    // both glamor and ui-box.
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
      <Html>
        <Head>
          <link rel='shortcut icon' href='./favicon.ico' />
          <link href='https://fonts.googleapis.com/css?family=Nunito:400,700,800&display=swap' rel='stylesheet' />
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