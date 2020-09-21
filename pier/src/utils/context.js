const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

module.exports = async function context({ req }) {
  let user = null;

  function authenticate() {
    if (user) return true;
    throw new AuthenticationError('authentication failed');
  }

  function authorize(ownerId) {
    if (user && ownerId.toString() === user.id) return true;
    throw new AuthenticationError('authorization failed');
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

  return { user, authenticate, authorize };
};
