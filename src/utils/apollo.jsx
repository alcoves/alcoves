import React from 'react';
import jwt from 'jsonwebtoken';
import { setContext, } from '@apollo/client/link/context';
import { createUploadLink, } from 'apollo-upload-client';
import { ApolloClient, InMemoryCache, ApolloProvider, } from '@apollo/client';

function serverUrl() {
  if (window.location.hostname === 'bken.io') return 'https://helm.bken.io/api/graphql';
  return 'http://localhost:4000/api/graphql';
}

export default function ApolloWrapper({ children }) {
  const httpLink = createUploadLink({
    uri: serverUrl(),
    headers: { 'keep-alive': 'true' }, 
  });

  const authLink = setContext((_, { headers, ...rest }) => {
    const token = localStorage.getItem('token');
    const link = {
      ...rest,
      headers: {
        ...headers,
      },
    };

    if (token) {
      const decoded = jwt.decode(token);
      if (Date.now() >= decoded.exp * 1000) {
        console.error('user token expired, logging out');
        localStorage.removeItem('token');
        window.location.replace('/login');
      } else {
        link.headers.Authorization = `Bearer ${token}`;
      }
    }
    return link;
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
