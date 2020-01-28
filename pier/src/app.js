const express = require('express');
const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');

const server = new ApolloServer({
  modules: [
    require('./gql/user'),
    require('./gql/video'),
    require('./gql/upload'),
  ],
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    if (token) {
      const user = jwt.verify(token.split(' ')[1], process.env.JWT_KEY);
      return { user };
    }
  },
  tracing: true,
});

const app = express();
server.applyMiddleware({ app });
module.exports = app;
