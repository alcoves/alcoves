const app = require('./app');
const mongoose = require('mongoose');
const port = process.env.PORT || 4000;

const startServer = async () => {
  mongoose.set('useCreateIndex', true);
  await mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
  });

  app.listen({ port }, () =>
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
  );
};

startServer();
