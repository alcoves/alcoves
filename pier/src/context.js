const jwt = require('jsonwebtoken');

const users = require('./loaders/users');
const videos = require('./loaders/videos');
const uploads = require('./loaders/uploads');

module.exports = ({ res, req }) => {
  let user = {};

  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';');

    const { idToken } = cookies.reduce((acc, c) => {
      if (c.includes('idToken=')) acc['idToken'] = c.split('idToken=')[1];
      if (c.includes('accessToken='))
        acc['accessToken'] = c.split('accessToken=')[1];
      if (c.includes('refreshToken='))
        acc['refreshToken'] = c.split('refreshToken=')[1];
      return acc;
    }, {});

    if (idToken) user = jwt.decode(idToken);
  }

  return {
    res,
    user,
    users,
    videos,
    uploads,
  };
};
