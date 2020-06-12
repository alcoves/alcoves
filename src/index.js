import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './components/index';
import ApolloClient from 'apollo-boost';

import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
});

const App = () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
