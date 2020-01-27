const Video = require('./model');
const convertObjectToDotNotation = require('../lib/convertObjectToDotNotation');

module.exports = {
  Query: {
    videos: async (_, input) => {
      return Video.find().populate('user', '_id avatar displayName');
    },
    video: async (_, { id }) => {
      return Video.findOne({ _id: id }).populate(
        'user',
        '_id avatar displayName'
      );
    },
  },
  Mutation: {
    updateVideo: async (_, { id, input }, { user }) => {
      // if (!user) throw new Error('authentication failed');
      await Video.updateOne(
        { _id: id },
        { $set: convertObjectToDotNotation(input) }
      );

      return Video.findOne({ _id: id }).populate(
        'user',
        '_id avatar displayName'
      );
    },
    updateVideoFile: async (_, { id, input }, { user }) => {
      const video = await Video.findOne({ _id: id });
      let shouldUpdate;

      video.files.map(({ preset }) => {
        if (preset === input.preset) shouldUpdate = true;
      });

      if (shouldUpdate) {
        const convertedArrToDot = Object.entries(input).reduce(
          (acc, [k, v]) => {
            acc[`files.$.${k}`] = v;
            return acc;
          },
          {}
        );

        // console.log(`files.preset`, input.preset);
        // console.log('convertedArrToDot', convertedArrToDot);

        await Video.updateOne(
          { _id: id, 'files.preset': input.preset },
          { $set: convertedArrToDot }
        );
      } else {
        await Video.updateOne({ _id: id }, { $push: { files: input } });
      }

      return Video.findOne({ _id: id }).populate(
        'user',
        '_id avatar displayName'
      );
    },
  },
};
