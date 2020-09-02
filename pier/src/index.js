require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');

const { DB_CONNECTION_STRING } = process.env;
if (!DB_CONNECTION_STRING) throw new Error('DB_CONNECTION_STRING is undefined');

const app = express();

const server = new ApolloServer({
  modules: [require('./schema/Users'), require('./schema/Videos'), require('./schema/Uploads')],
  tracing: true,
  playground: true,
  introspection: true,
  context: require('./middlewares/context'),
});

server.applyMiddleware({
  app,
  path: '/graphql',
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

  app.listen(
    {
      port: process.env.PORT || 4000,
    },
    () => console.log('🚀 Server ready at http://localhost:4000/graphql')
  );
}

module.exports = app;
