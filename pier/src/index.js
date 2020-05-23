// const { ApolloServer } = require('apollo-server-lambda');

// const server = new ApolloServer({
//   modules: [
//     require('./schema/Users'),
//     require('./schema/Videos'),
//     require('./schema/Uploads'),
//   ],
//   context: require('./context'),
//   tracing: true,
//   playground: true,
//   introspection: true,
// });

// module.exports.handler = server.createHandler({
//   cors: {
//     origin: true,
//     credentials: true,
//   },
// });

// graphql.js

const { ApolloServer, gql } = require('apollo-server-lambda');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  playground: true,
  introspection: true,
  // playground: {
  //   endpoint: '/dev/graphql',
  // },
});

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
