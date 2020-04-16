const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const { NODE_ENV, BKEN_ENV } = process.env;

const getOrigin = (originUrl) => {
  if (BKEN_ENV === 'dev' && NODE_ENV === 'production') {
    originUrl = 'https://dev.bken.io';
  } else if (BKEN_ENV === 'prod' && NODE_ENV === 'production') {
    originUrl = 'https://bken.io';
  } else {
    originUrl = 'http://localhost:3000';
  }

  console.log({ NODE_ENV, BKEN_ENV });
  console.log(`originUrl: ${originUrl}`);
  return originUrl;
};

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
  app,
  path: '/api/graphql',
  cors: {
    credentials: true,
    origin: getOrigin(),
  },
});

module.exports = app;
