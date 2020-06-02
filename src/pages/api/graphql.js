import { ApolloServer } from 'apollo-server-micro';

const apolloServer = new ApolloServer({
  modules: [require('./schema/Users'), require('./schema/Videos'), require('./schema/Uploads')],
  context: require('./context'),
  tracing: true,
  introspection: true,
  playground: { endpoint: '/api/graphql' },
});

const handler = apolloServer.createHandler({ path: '/api/graphql' });
export const config = { api: { bodyParser: false } };

export default handler;
