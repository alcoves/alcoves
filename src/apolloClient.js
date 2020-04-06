import fetch from 'isomorphic-unfetch'

import { HttpLink } from 'apollo-link-http'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

export default function createApolloClient(initialState, ctx) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: new HttpLink({
      fetch,
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      uri: 'http://localhost:4000/api/graphql', // Server URL (must be absolute)
    }),
    cache: new InMemoryCache().restore(initialState),
  })
}