import React, { useState, useContext } from 'react';
import { setContext } from '@apollo/client/link/context';
import { CognitoContext } from '../contexts/CognitoContext';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';

function serverUrl() {
  if (window.location.hostname === 'bken.io') {
    return 'https://api.bken.io/graphql';
  } else {
    return 'http://localhost:4000/graphql';
  }
}

export default function ApolloWrapper({ children }) {
  const { pool } = useContext(CognitoContext);
  const [bearerToken, setBearerToken] = useState('');

  const httpLink = createHttpLink({
    uri: serverUrl(),
  });

  const authLink = setContext((_, { headers, ...rest }) => {
    const cognitoUser = pool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.getSession(function (err, session) {
        if (err) console.error('failed to get token from cognito user session');
        if (session.isValid()) {
          setBearerToken(session.accessToken.jwtToken);
        }
      });
    }

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
