const jwt = require('jsonwebtoken');

const users = require('./loaders/users');
const videos = require('./loaders/videos');
const uploads = require('./loaders/uploads');

module.exports = ({ req }) => {
  let user = null;
  const token = req.headers.authorization || '';
  if (token) { jwt.verify(token.split(' ')[1], process.env.JWT_KEY) }

  return {
    user,
    users,
    videos,
    uploads,
  };
};
