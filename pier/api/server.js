const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
});

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
