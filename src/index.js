import 'semantic-ui-css/semantic.min.css';
import './index.css';

import App from './app';
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from './lib/apollo';

import { ApolloProvider } from '@apollo/react-hooks';

const Index = () => (
  <ApolloProvider client={ApolloClient}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Index />, document.getElementById('root'));
