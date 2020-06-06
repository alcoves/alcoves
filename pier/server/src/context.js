const jwt = require('jsonwebtoken');

const users = require('./loaders/users');
const videos = require('./loaders/videos');
const uploads = require('./loaders/uploads');

module.exports = (event) => {
  console.log('event', event);
  let user = {};

  if (event.event) {
    event = event.event;
  } else if (event.req) {
    event = event.req;
  }

  // Handles local server
  // if (event.req) event = event.req;

  console.log('event.headers', event.headers);
  console.log('event.headers.cookie', event.headers.cookie);
  if (event.headers && event.headers.cookie) {
    const cookies = event.headers.cookie.split(';');
    console.log('cookies', cookies);

    const tokens = cookies.reduce((acc, c) => {
      if (c.includes('idToken=')) acc['idToken'] = c.split('idToken=')[1];
      if (c.includes('accessToken='))
        acc['accessToken'] = c.split('accessToken=')[1];
      if (c.includes('refreshToken='))
        acc['refreshToken'] = c.split('refreshToken=')[1];
      return acc;
    }, {});

    console.log('tokens', tokens);
    if (tokens.idToken) user = jwt.decode(tokens.idToken);
  }

  console.log('user', user);
  if (!Object.keys(user).length) throw new Error('failed to authenticate user');

  return {
    user,
    users,
    videos,
    uploads,
  };
};
