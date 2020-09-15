const jwt = require('jsonwebtoken');

module.exports = async event => {
  let user = null;
  let isAuthenticated = false;

  try {
    const authHeader = event.req.headers.authorization || '';
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_KEY);
      user = payload || null;
      isAuthenticated = !!user;
    }
  } catch (error) {
    console.error(error);
  }

  return { user, isAuthenticated };
};
