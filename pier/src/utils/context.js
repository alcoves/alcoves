const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

module.exports = async function context({ req }) {
  let user = null;

  // Schema Directives may be the best way to enforce authentication
  // https://www.apollographql.com/docs/apollo-server/schema/creating-directives/
  function authenticate() {
    if (user) return true;
    throw new AuthenticationError('authentication failed');
  }

  function authorize(ownerId) {
    if (user && ownerId.toString() === user.id) return true;
    throw new AuthenticationError('authorization failed');
  }

  const authHeader = req.headers.authorization || '';
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      const decoded = jwt.decode(token);
      if (Date.now() >= decoded.exp * 1000) throw new AuthenticationError('expired token');

      const payload = jwt.verify(token, process.env.JWT_KEY);
      user = payload || null;
    }
  }

  return { user, authenticate, authorize };
};
