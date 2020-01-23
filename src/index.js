import 'regenerator-runtime/runtime';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

import React from 'react';
import ReactGA from 'react-ga';
import App from './components/App/App';
import ApolloClient from 'apollo-boost';

import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';

ReactGA.initialize('UA-77834417-2');

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
});

const Root = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

render(<Root />, document.getElementById('root'));
