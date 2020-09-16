const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

module.exports = async function context({ req }) {
  let user = null;

  function requireAuth() {
    if  (!user)  throw new AuthenticationError('authentication required');
    return true;
  }

  try {
    const authHeader = req.headers.authorization || '';
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        user = payload || null;
      }
    }
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error decoding token', error);
  }

  return { user, requireAuth };
};
