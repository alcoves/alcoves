import 'semantic-ui-css/semantic.min.css';
import './index.css';

import App from './app';
import React from 'react';
import Theme from './theme';
import ReactDOM from 'react-dom';
import ApolloClient from './lib/apollo';

import { RecoilRoot } from 'recoil';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/styles';

const Index = () => (
  <RecoilRoot>
    <ThemeProvider theme={Theme}>
      <ApolloProvider client={ApolloClient}>
        <React.Suspense fallback={<div />}>
          <App />
        </React.Suspense>
      </ApolloProvider>
    </ThemeProvider>
  </RecoilRoot>
);

ReactDOM.render(<Index />, document.getElementById('root'));
