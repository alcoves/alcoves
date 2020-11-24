require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const context = require('./utils/context');
const users = require('./modules/users/index');
const views = require('./modules/views/index');
const videos = require('./modules/videos/index');
const uploads = require('./modules/uploads/index');

const app = express();
app.set('trust proxy', true);

const server = new ApolloServer({
  context,
  tracing: true,
  playground: true,
  introspection: true,
  formatError: console.error,
  modules: [
    users,
    views,
    videos,
    uploads,
  ],
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
  const { DB_CONNECTION_STRING } = process.env;
  if (!DB_CONNECTION_STRING) throw new Error('DB_CONNECTION_STRING is undefined');

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
