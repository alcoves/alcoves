const { ApolloServer } = require('apollo-server-lambda');

const server = new ApolloServer({
  modules: [
    require('./schema/Users'),
    require('./schema/Videos'),
    require('./schema/Uploads'),
  ],
  context: require('./context'),
  tracing: true,
  playground: true,
  introspection: true,
});

module.exports.handler = server.createHandler();
