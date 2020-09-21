import './index.css';

import App from './app';
import React from 'react';
import Theme from './theme';
import ReactDOM from 'react-dom';
import ApolloWrapper from './utils/apollo';
import UserContextProvider from './contexts/UserContext';
import SearchContextProvider from './contexts/SearchContext';

import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router } from 'react-router-dom';

const Index = () => (
  <Router>
    <ThemeProvider theme={Theme}>
      <ApolloWrapper>
        <SnackbarProvider maxSnack={3}>
          <UserContextProvider>
            <SearchContextProvider>
              <App />
            </SearchContextProvider>
          </UserContextProvider>
        </SnackbarProvider>
      </ApolloWrapper>
    </ThemeProvider>
  </Router>
);

ReactDOM.render(<Index />, document.getElementById('root'));
