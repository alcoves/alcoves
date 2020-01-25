const Video = require('./model');
const convertObjectToDotNotation = require('../lib/convertObjectToDotNotation');

module.exports = {
  Query: {
    videos: async (_, input) => {
      return Video.find();
    },
    video: async (_, { id }) => {
      return Video.findOne({ _id: id });
    },
  },
  Mutation: {
    updateVideo: async (_, { id, input }, { user }) => {
      // if (!user) throw new Error('authentication failed');

      await Video.updateOne(
        { _id: id },
        { $set: convertObjectToDotNotation(input) }
      );

      return Video.findOne({ _id: id });
    },
  },
};
