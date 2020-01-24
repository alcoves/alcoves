const User = require('./model');
const Login = require('./login');
const Register = require('./register');

module.exports = {
  Query: {
    user: async (_, { id }, { user }) => {
      if (!user) throw new Error('authorization failed');
      return User.findOne({ _id: id });
    },
  },
  Mutation: {
    login: async (_, { input }) => {
      return Login(input);
    },
    register: async (_, { input }) => {
      return Register(input);
    },
    uploadAvatar: async (parent, { file }) => {
      const { stream, filename, mimetype, encoding } = await file;

      console.log(file);
      // 1. Validate file metadata.

      // 2. Stream file contents into cloud storage:
      // https://nodejs.org/api/stream.html

      // 3. Record the file upload in your DB.
      // const id = await recordFile( … )

      return { filename, mimetype, encoding };
    },
  },
};
