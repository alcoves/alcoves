import './index.css';

import App from './app';
import React from 'react';
import Theme from './theme';
import ReactDOM from 'react-dom';
import ApolloWrapper from './lib/apollo';
import UserContextProvider from './contexts/UserContext';

import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router } from 'react-router-dom';

const Index = () => (
  <Router>
    <UserContextProvider>
      <ThemeProvider theme={Theme}>
        <SnackbarProvider maxSnack={3}>
          <ApolloWrapper>
            <App />
          </ApolloWrapper>
        </SnackbarProvider>
      </ThemeProvider>
    </UserContextProvider>
  </Router>
);

ReactDOM.render(<Index />, document.getElementById('root'));
