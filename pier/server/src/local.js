require('dotenv').config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const app = express();

const server = new ApolloServer({
  modules: [
    require('./schema/Users'),
    require('./schema/Videos'),
    require('./schema/Uploads'),
  ],
  context: require('./context'),
  tracing: true,
  playground: true,
  introspection: true,
});

server.applyMiddleware({
  app,
  path: '/graphql',
  cors: {
    origin: true,
    credentials: true,
  },
});

app.listen({ port: 4000 }, () =>
  console.log('🚀 Server ready at http://localhost:4000/graphql')
);
