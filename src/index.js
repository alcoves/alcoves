import './index.css';

import App from './app';
import React from 'react';
import Theme from './theme';
import Auth0 from './lib/auth0';
import ReactDOM from 'react-dom';
import ApolloWrapper from './lib/apollo';

import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router } from 'react-router-dom';

const Index = () => (
  <Router>
    <Auth0>
      <RecoilRoot>
        <ThemeProvider theme={Theme}>
          <SnackbarProvider maxSnack={3}>
            <ApolloWrapper>
              <App />
            </ApolloWrapper>
          </SnackbarProvider>
        </ThemeProvider>
      </RecoilRoot>
    </Auth0>
  </Router>
);

ReactDOM.render(<Index />, document.getElementById('root'));
