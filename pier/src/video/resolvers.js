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
    updateVideoFile: async (_, { id, input }, { user }) => {
      const video = await Video.findOne({ _id: id });
      let shouldUpdate;

      video.files.map(({ preset }) => {
        if (preset === input.preset) shouldUpdate = true;
      });

      if (shouldUpdate) {
        console.log('updating file instead of pushing');
        const convertedArrToDot = Object.entries(input).reduce(
          (acc, [k, v]) => {
            acc[`files.$.${k}`] = v;
            return acc;
          },
          {}
        );

        console.log(`files.preset`, input.preset);
        console.log('convertedArrToDot', convertedArrToDot);

        await Video.updateOne(
          { _id: id, 'files.preset': input.preset },
          { $set: convertedArrToDot }
        );
      } else {
        console.log('pushing new file obj to array');
        await Video.updateOne({ _id: id }, { $push: { files: input } });
      }

      return Video.findOne({ _id: id });
    },
  },
};
