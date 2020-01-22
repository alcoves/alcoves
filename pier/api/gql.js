const express = require('express');
const mongoose = require('mongoose');

const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');
const { ApolloServer } = require('apollo-server-express');

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  server.applyMiddleware({ app });

  mongoose.set('useCreateIndex', true);
  await mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
  });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
