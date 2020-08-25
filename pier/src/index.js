require('dotenv').config();

console.log(process.env.PG_CONNECTION_STRING);

const express = require('express');
const {
  ApolloServer
} = require('apollo-server-express');

const app = express();

const server = new ApolloServer({
  modules: [
    require('./schema/Users'),
    require('./schema/Videos'),
    require('./schema/Uploads'),
  ],
  tracing: true,
  playground: true,
  introspection: true,
  context: require('./context'),
});

server.applyMiddleware({
  app,
  path: '/graphql',
  cors: {
    origin: true,
    credentials: true,
  },
});

if (!module.parent) {
  app.listen({
      port: process.env.PORT || 4000
    }, () =>
    console.log('🚀 Server ready at http://localhost:4000/graphql')
  );
}

module.exports = app;