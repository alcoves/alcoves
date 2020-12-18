import React from 'react';
import Document, { Html, Head, Main, NextScript, } from 'next/document';

function mediaAds() {
  window._mNHandle = window._mNHandle || {};
  window._mNHandle.queue = window._mNHandle.queue || [];
  medianet_versionId = '3121199';
}
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='shortcut icon' href='./favicon.ico' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap' rel='stylesheet' />
          <meta name='version' content='%REACT_APP_GIT_SHA%' />
          <meta property='og:title' content='bken.io' />
          <meta property='og:url' content='https://bken.io' />
          <meta property='og:image' content='./favicon.ico' />
          <meta property='og:description' content='bken.io is a video sharing platform' />
          <script type='text/javascript'>
            {mediaAds()}
          </script>
          <script src='https://contextual.media.net/dmedianet.js?cid=8CUX14CQ8' async='async' />
        </Head>
        <body>
          <script src='https://cdn.jsdelivr.net/npm/hls.js@latest' />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}