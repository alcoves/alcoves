require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const users = require('./modules/users/index');
const uploads = require('./modules/uploads/index');
const videos = require('./modules/videos/index');
const context = require('./utils/context');

const { DB_CONNECTION_STRING } = process.env;
if (!DB_CONNECTION_STRING) throw new Error('DB_CONNECTION_STRING is undefined');

const app = express();

const server = new ApolloServer({
  context,
  tracing: true,
  playground: true,
  introspection: true,
  modules: [users, videos, uploads],
  // modules: [require('./modules/users/index'), require('./modules/uploads/index'), require('./modules/videos/index')]
});

server.applyMiddleware({
  app,
  path: '/api/graphql',
  cors: {
    origin: true,
    credentials: true,
  },
});

if (!module.parent) {
  mongoose.connect(DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  const port = process.env.PORT || 4000;

  app.listen({ port }, () =>  {
    // eslint-disable-next-line
    console.info(`⚓ http://localhost:${port} ⚓`);
  });
}

module.exports = app;
