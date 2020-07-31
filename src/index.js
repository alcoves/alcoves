import './index.css';

import App from './app';
import React from 'react';
import Theme from './theme';
import ReactDOM from 'react-dom';
import ApolloClient from './lib/apollo';

import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@material-ui/styles';

const Index = () => (
  <RecoilRoot>
    <ThemeProvider theme={Theme}>
      <SnackbarProvider maxSnack={3}>
        <ApolloProvider client={ApolloClient}>
          <App />
        </ApolloProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </RecoilRoot>
);

ReactDOM.render(<Index />, document.getElementById('root'));
