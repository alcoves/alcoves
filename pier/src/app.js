const express = require('express');
const jwt = require('jsonwebtoken');
const recReadSync = require('recursive-readdir-sync');
const { ApolloServer } = require('apollo-server-express');

const getFiles = (name) => {
  return recReadSync(__dirname).reduce((acc, path) => {
    if (path.includes(name)) acc.push(require(path));
    return acc;
  }, []);
};

const server = new ApolloServer({
  typeDefs: getFiles('typeDefs.js'),
  resolvers: getFiles('resolvers.js'),
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
