const verifyToken = require('./lib/verifyToken');

module.exports = async (event) => {
  let user = null;
  let isAuthenticated = false;

  // this supports local server and lambda
  if (event.event) {
    event = event.event;
  } else if (event.req) {
    event = event.req;
  }

  try {
    const authHeader = event.headers.authorization || '';

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const payload = await verifyToken(token);
      user = payload ? payload : null;
      isAuthenticated = payload ? true : false;
    }
  } catch (error) {
    console.error(error);
  }

  return { auth: { isAuthenticated, user } };
};
