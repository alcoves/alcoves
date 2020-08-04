import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';

function serverUrl() {
  if (window.location.hostname === 'dev.bken.io') {
    return 'https://dev-api.bken.io/graphql';
  } else if (window.location.hostname === 'bken.io') {
    return 'https://api.bken.io/graphql';
  } else {
    return 'http://localhost:4000/graphql';
  }
}

export default function ApolloWrapper({ children }) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [bearerToken, setBearerToken] = useState('');

  useEffect(() => {
    const getToken = async () => {
      const token = isAuthenticated ? await getAccessTokenSilently() : '';
      setBearerToken(token);
    };
    getToken();
  }, [getAccessTokenSilently, isAuthenticated]);

  const httpLink = createHttpLink({
    uri: serverUrl(),
  });

  const authLink = setContext((_, { headers, ...rest }) => {
    if (!bearerToken) return { headers, ...rest };

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
