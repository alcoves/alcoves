require('dotenv').config();

const app = require('./app');
const port = process.env.PORT || 4000;

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://127.0.0.1:${port}/graphql`)
);