const User = require('./model');

module.exports = {
  Query: {
    user: async (_, { id }) => {
      return User.findOne({ _id: id });
    },
  },
  Mutation: {
    createUser: async (_, { input }) => {
      return new User(input).save();
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
