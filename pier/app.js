const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
const cookieParser = require('cookie-parser');

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const port = process.env.PORT || 3000;

// const whitelist = [
//   'https://bken.io',
//   'https://api.bken.io',
//   'http://localhost:1234',
//   `http://localhost:${port}`,
// ];

const corsOptions = {
  origin: 'http://localhost:1234',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(responseTime());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./api/routes/root'));
app.use('/user', require('./api/routes/user'));
app.use('/posts', require('./api/routes/posts'));
app.use('/channels', require('./api/routes/channels'));

app.use((req, res, next) => {
  const error = new Error('not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(500).send({
    message: error.message || 'unknown',
    error,
  });
});

app.listen(port, () => console.log(`started on ${port}`));
