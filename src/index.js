import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider, } from 'notistack';
import { ThemeProvider, } from '@material-ui/styles';
import { BrowserRouter as Router, } from 'react-router-dom';
import App from './app';
import Theme from './theme';
import ApolloWrapper from './utils/apollo';
import UserContextProvider from './contexts/userContext';
import SearchContextProvider from './contexts/searchContext';

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
