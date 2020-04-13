const jwt = require('jsonwebtoken');

const users = require('./loaders/users');
const videos = require('./loaders/videos');
const uploads = require('./loaders/uploads');

module.exports = ({ res, req }) => {
  let user = {};
  const { cookie = '' } = req.headers
  const token = cookie.split('accessToken=')[1]
  if (token) user = jwt.verify(token, process.env.JWT_KEY)

  return {
    res,
    user,
    users,
    videos,
    uploads,
  };
};
