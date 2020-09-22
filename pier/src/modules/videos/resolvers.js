const Video = require('./model');
const { getUserById } = require('../users/resolvers');
const { getVideosByUsername, getTidalVersionsById, deleteVideo, getTidalThumbnailsById } = require('./loaders');

const resolvers =  {
  Video: {
    tidal({ id }) {
      return getTidalVersionsById(id);
    },
    user({ user }) {
      return getUserById(user);
    },
    thumbnails({ id }) {
      return getTidalThumbnailsById(id);
    },
  },
  Query: {
    video(__, { id }) {
      return Video.findById(id);
    },
    async videos(_, { title }) {
      return Video.find({ visibility: 'public', '$text': {'$search': title} }).sort({ createdAt: -1 });
    },
    getRecentVideos() {
      return Video.find({ visibility: 'public' }).sort({ createdAt: -1 });
    },
    videosByUsername(__, { username }) {
      return getVideosByUsername(username);
    },
  },
  Mutation: {
    async deleteVideo(__, { id }, { user, authenticate }) {
      authenticate();
      const video = await Video.find({ _id: id, user: user.id });
      return video ? deleteVideo(video) : null;
    },
    async updateVideoTitle(__, { input: { id, title } }, { user, authenticate }) {
      authenticate();
      return Video.findOneAndUpdate({ _id: id, user: user.id }, { title }, { new: true });
    },
    async updateVideoVisibility(__, { id, visibility }, { user, authenticate }) {
      authenticate();
      return  Video.findOneAndUpdate({ _id: id, user: user.id }, { visibility }, { new: true });
    },
  },
};

module.exports = {
  resolvers,
};
