import fetch from 'isomorphic-unfetch'

import { HttpLink } from 'apollo-link-http'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

const getServerUrl = () => {
  if (process.env.BKEN_ENV === 'dev') return 'https://dev.bken.io/api/graphql'
  if (process.env.BKEN_ENV === 'prod') return 'https://bken.io/api/graphql'
  return 'http://localhost:4000/api/graphql'
}

export default function createApolloClient(initialState, ctx) {
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    cache: new InMemoryCache().restore(initialState),
    link: new HttpLink({
      fetch,
      uri: getServerUrl(),
      credentials: 'include'
    }),
  })
}