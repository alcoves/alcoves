const User = require('../model');

async function me(_, { id }, { authenticate, authorize }) {
  authenticate();
  authorize(id);
  return User.findById(id);
}

module.exports = me;