const jwt = require('jsonwebtoken');

const users = require('./loaders/users');
const videos = require('./loaders/videos');
const uploads = require('./loaders/uploads');

module.exports = (event) => {
  // console.log('event', event);
  let user = null;

  if (event.event) {
    event = event.event;
  } else if (event.req) {
    event = event.req;
  }

  if (event.headers && event.headers.authorization) {
    const token = event.headers.authorization.split('Bearer ')[1];
    if (token) user = jwt.decode(token);
  }

  if (user) {
    console.log(`request from user: ${user.sub}`);
  }

  return {
    user,
    users,
    videos,
    uploads,
  };
};
