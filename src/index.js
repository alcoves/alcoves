import './index.css';

import App from './app';
import React from 'react';
import Theme from './theme';
import ReactDOM from 'react-dom';
import ApolloWrapper from './lib/apollo';
import CognitoContextProvider from './contexts/CognitoContext';

import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router } from 'react-router-dom';

const Index = () => (
  <Router>
    <CognitoContextProvider>
      <ThemeProvider theme={Theme}>
        <SnackbarProvider maxSnack={3}>
          <ApolloWrapper>
            <App />
          </ApolloWrapper>
        </SnackbarProvider>
      </ThemeProvider>
    </CognitoContextProvider>
  </Router>
);

ReactDOM.render(<Index />, document.getElementById('root'));
