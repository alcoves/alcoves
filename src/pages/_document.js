import React from 'react';
import Document from 'next/document';
import { ServerStyleSheet, } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            <link rel='shortcut icon' href='./favicon.ico' />
            <link rel='preconnect' href='https://fonts.gstatic.com' />
            <link href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap' rel='stylesheet' />
            <meta name='version' content='%REACT_APP_GIT_SHA%' />
            <meta property='og:title' content='bken.io' />
            <meta property='og:url' content='https://bken.io' />
            <meta property='og:image' content='./favicon.ico' />
            <meta property='og:description' content='bken.io is a video sharing platform' />
            <script src='https://cdn.jsdelivr.net/npm/hls.js@latest' />
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}