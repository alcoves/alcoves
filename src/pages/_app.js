import 'semantic-ui-css/semantic.min.css';
import './index.css';

import React from 'react';
import App, { Container } from 'next/app';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default MyApp;