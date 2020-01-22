const express = require('express');
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
});

const app = express();
server.applyMiddleware({ app });
module.exports = app;
