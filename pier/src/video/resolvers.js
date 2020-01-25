const Video = require('./model');
const convertObjectToDotNotation = require('../lib/convertObjectToDotNotation');

module.exports = {
  Query: {
    videos: async (_, input) => {
      return Video.find();
    },
  },
  Mutation: {
    updateVideo: async (_, { input }, { user }) => {
      if (!user) throw new Error('authentication failed');

      // only allow users that own the video to edit them
      // allow system api keys to update videos

      const videoUpdate = { ...input };
      delete videoUpdate.id;

      await Video.updateOne(
        { _id: input.id },
        { $set: convertObjectToDotNotation(videoUpdate) }
      );

      return Video.findOne({ _id: input.id });
    },
  },
};
