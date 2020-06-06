import fetch from 'isomorphic-unfetch';

import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

const getServerUrl = apiUrl => {
  const BKEN_ENV = process.env.BKEN_ENV;
  const NODE_ENV = process.env.NODE_ENV;

  if (BKEN_ENV === 'dev' && NODE_ENV === 'production') {
    apiUrl = 'https://dev.bken.io/api/graphql';
  } else if (BKEN_ENV === 'prod' && NODE_ENV === 'production') {
    apiUrl = 'https://bken.io/api/graphql';
  } else {
    apiUrl = 'http://localhost:4000';
  }

  console.log(`apiUrl: ${apiUrl}`);
  return apiUrl;
};

export default function createApolloClient(initialState, ctx) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: new HttpLink({
      fetch,
      uri: getServerUrl(), // Server URL (must be absolute)
      credentials: 'include', // Additional fetch() options like `credentials` or `headers`
      headers: {
        cookie: ctx && ctx.req ? ctx.req.headers.cookie : undefined,
      },
    }),
    cache: new InMemoryCache().restore(initialState),
  });
}
