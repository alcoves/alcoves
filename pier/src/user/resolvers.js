const User = require('./model');

module.exports = {
  Query: {
    users: () => User.find(),
  },
  Mutation: {
    createUser: async (_, { displayName }) => {
      const user = new User({ displayName });
      await user.save();
      return user;
    },
  },
};
