require('dotenv').config();

const app = require('./app');
const port = process.env.PORT || 4000;

const startServer = async () => {
  app.listen({ port }, () =>
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
  );
};

startServer();
