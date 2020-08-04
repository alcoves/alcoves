const verifyToken = require('./lib/verifyToken');

module.exports = async (event) => {
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
      isAuthenticated = payload ? true : false;
      console.log('isAuthenticated', isAuthenticated);
      // go get the user from the database
    }
  } catch (error) {
    console.error(error);
  }

  return { isAuthenticated };
};
