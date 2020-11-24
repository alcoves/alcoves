const jwt = require('jsonwebtoken');
const { AuthenticationError, ApolloError } = require('apollo-server-express');

module.exports = async function context({ req }) {
  let user = null;

  // Schema Directives may be the best way to enforce authentication
  // https://www.apollographql.com/docs/apollo-server/schema/creating-directives/
  function authenticate() {
    if (user) return true;
    throw new AuthenticationError('authentication failed');
  }

  function authorize(entity, id) {
    if (!user) throw new AuthenticationError('no user to authorize');

    if (entity === 'user') {
      if (user.id === id.toString()) return true;
      throw new AuthenticationError('user authorization failed');
    } else if (entity === 'role') {
      if (user.roles) {
        if (user.roles.includes('admin')) return true;
        throw new AuthenticationError('role authorization failed');
      }

      throw new AuthenticationError('role authorization failed');
    } else {
      throw new ApolloError(`unsupported authorization entity: ${entity}`);
    }
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

  return { req, user, authenticate, authorize };
};
