import React, { useState } from 'react';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';

function serverUrl() {
  if (window.location.hostname === 'bken.io') {
    return 'https://helm.bken.io/api/graphql';
  } else {
    return 'http://localhost:4000/api/graphql';
  }
}

export default function ApolloWrapper({ children }) {
  const httpLink = createHttpLink({ uri: serverUrl() });

  const authLink = setContext((_, { headers, ...rest }) => {
    return {
      ...rest,
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
