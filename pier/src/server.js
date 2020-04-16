require('dotenv').config();

const app = require('./app');
const port = process.env.PORT || 4000;

app.get('/', (req, res) => res.send('taffy3'));
app.get('/api', (req, res) => res.send('taffy3'));

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/api/graphql`)
);
