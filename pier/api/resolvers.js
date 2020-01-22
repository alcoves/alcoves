const User = require('./models/user');

module.exports.resolvers = {
  Query: {
    hello: () => 'hi',
    user: () => User.find(),
  },
  Mutation: {
    createUser: async (_, { displayName }) => {
      const user = new User({ displayName });
      await user.save();
      return user;
    },
  },
};
