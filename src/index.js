import 'semantic-ui-css/semantic.min.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './components/index';
import ApolloClient from './lib/apollo';

import { ApolloProvider } from '@apollo/react-hooks';

const App = () => (
  <ApolloProvider client={ApolloClient}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
