require('dotenv').config();

const app = require('./app');
const port = process.env.PORT || 4000;

app.get('/', () => res.send('taffy3'))

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
);