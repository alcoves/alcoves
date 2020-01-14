require('dotenv').config();

const cors = require('cors');
const axios = require('axios');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(responseTime());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./routes/root'));
app.use('/me', require('./routes/me'));
app.use('/users', require('./routes/users'));
app.use('/login', require('./routes/login'));
app.use('/videos', require('./routes/videos'));
app.use('/uploads', require('./routes/uploads'));
app.use('/register', require('./routes/register'));
app.use('/followings', require('./routes/followings'));

app.use((req, res, next) => {
  const error = new Error('not found');
  error.status = 404;
  next(error);
});

app.use(async (error, req, res, next) => {
  if (error && error.status) {
    if (error.status >= 500) {
      await axios.post(process.env.DISCORD_WEBHOOK_URL, {
        content: JSON.stringify({ error, req }),
        username: 'API Error Bot',
      });
    }
    res.status(error.status || 500).send({
      message: error.message || 'unknown',
      error,
    });
  }
});

module.exports = app;
