const Video = require('./model');

module.exports = {
  Query: {
    videos: async (_, input) => {
      return Video.find();
    },
  },
};
