import { ApolloServer } from 'apollo-server-micro';

const apolloServer = new ApolloServer({
  modules: [
    require('../../gql/schema/Users'),
    require('../../gql/schema/Videos'),
    require('../../gql/schema/Uploads'),
  ],
  context: require('../../gql/context'),
  tracing: true,
  introspection: true,
  playground: { endpoint: '/api/graphql' },
});

const handler = apolloServer.createHandler({ path: '/api/graphql' });
export const config = { api: { bodyParser: false } };

export default handler;
