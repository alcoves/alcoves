const { gql } = require('apollo-server-lambda');
const { getUserById } = require('../loaders/users');
const {
  deleteVideo,
  createVideo,
  getVideoById,
  updateVideoTitle,
  getTidalVersions,
  getTidalThumbnail,
  setVideoVisability,
  getVideosByUsername,
} = require('../loaders/videos');

module.exports.typeDefs = gql`
  extend type Query {
    video(id: String!): Video!
    videosByUsername(username: String!): [Video!]!
  }
  extend type Mutation {
    deleteVideo(id: String!): Boolean!
    createVideo(input: CreateVideoInput!): Video!
    updateVideoTitle(id: String!, title: String!): Video!
    setVideoVisability(id: String!, visability: String!): Video!
  }
  type Video {
    id: String!
    user: User!
    views: Int!
    title: String!
    duration: Float!
    thumbnail: String!
    createdAt: String!
    modifiedAt: String!
    visability: String!
    versions: [VideoVersion!]
  }
  type VideoVersion {
    link: String
    status: String!
    preset: String!
    percentCompleted: Float!
  }
  input CreateVideoInput {
    user: String!
    title: String!
  }
`;

module.exports.resolvers = {
  Video: {
    async thumbnail({ id }) {
      return getTidalThumbnail(id);
    },
    user({ user }) {
      return getUserById(user);
    },
    async versions({ id }) {
      return getTidalVersions(id);
    },
  },
  Query: {
    video(_, { id }) {
      return getVideoById(id);
    },
    videosByUsername(_, { username }) {
      return getVideosByUsername(username);
    },
  },
  Mutation: {
    deleteVideo(_, { id }) {
      return deleteVideo(id);
    },
    createVideo(_, { input }) {
      return createVideo(input);
    },
    updateVideoTitle(_, { id, title }) {
      return updateVideoTitle({ id, title });
    },
    setVideoVisability() {
      return setVideoVisability({ id, visability });
    },
  },
};
