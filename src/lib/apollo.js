import React, { useState } from 'react';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';

function serverUrl() {
  if (window.location.hostname === 'bken.io') {
    return 'https://api.bken.io/graphql';
  } else {
    return 'http://localhost:4000/graphql';
  }
}

export default function ApolloWrapper({ children }) {
  const [bearerToken, setBearerToken] = useState('');
  const httpLink = createHttpLink({ uri: serverUrl() });

  const authLink = setContext((_, { headers, ...rest }) => {
    setBearerToken(localStorage.getItem('token'));
    return {
      ...rest,
      headers: {
        ...headers,
        authorization: `Bearer ${bearerToken}`,
      },
    };
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
