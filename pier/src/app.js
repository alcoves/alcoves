const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const getOrigin = () => {
  if (process.env.BKEN_ENV === 'prod') return 'https://bken.io'
  if (process.env.BKEN_ENV === 'dev') return 'https://dev.bken.io'
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