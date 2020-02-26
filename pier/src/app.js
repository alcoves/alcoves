const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const server = new ApolloServer({
  modules: [
    require('./gql/user'),
    require('./gql/video'),
    require('./schema/Uploads'),
  ],
  context: require('./context'),
  tracing: true,
});

const app = express();
server.applyMiddleware({ app });
module.exports = app;
