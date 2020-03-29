const jwt = require('jsonwebtoken');

const videos = require('./loaders/videos');

module.exports = ({ req }) => {
  let user = null;
  const token = req.headers.authorization || '';
  if (token) { jwt.verify(token.split(' ')[1], process.env.JWT_KEY) }

  return {
    user,
    videos,
  };
};
