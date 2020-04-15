const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const {
  NODE_ENV,
  BKEN_ENV
} = process.env

const getOrigin = () => {
  if (BKEN_ENV === 'prod' && NODE_ENV === 'production') return 'https://bken.io'
  if (BKEN_ENV === 'dev' && NODE_ENV === 'production') return 'https://dev.bken.io'
  return 'http://localhost:3000'
}

const server = new ApolloServer({
  modules: [
    require('./schema/Users'),
    require('./schema/Videos'),
    require('./schema/Uploads'),
  ],
  context: require('./context'),
  tracing: true,
});

const app = express();

server.applyMiddleware({
  app, path: '/api/graphql', cors: {
    credentials: true,
    origin: getOrigin(),
  }
});

module.exports = app;