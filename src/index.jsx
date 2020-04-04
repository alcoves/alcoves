import 'regenerator-runtime/runtime';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

import React from 'react';
import ReactGA from 'react-ga';
import ApolloClient from 'apollo-boost';

import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';

import App from './components/App/App';

ReactGA.initialize('UA-77834417-2');

const client = new ApolloClient({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://api.bken.io/graphql'
      : 'http://localhost:4000/graphql',
  request: operation => {
    const token = localStorage.getItem('accessToken');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

const Root = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

render(<Root />, document.getElementById('root'));
