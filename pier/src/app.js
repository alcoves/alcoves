const express = require('express');
const { ApolloServer } = require('apollo-server-express');

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
server.applyMiddleware({ app, path: '/api/graphql' });
module.exports = app;