const { gql, AuthenticationError } = require('apollo-server-express');
const { getUserById } = require('../loaders/users');
const {
  deleteVideo,
  getVideoById,
  // updateVideoTitle,
  // setVideoVisibility,
  // getVideosByNickname,
  getVideosByUsername,
  getTidalVersionsById,
  getTidalThumbnailsById,
} = require('../loaders/videos');

module.exports.typeDefs = gql`
  extend type Query {
    video(id: String!): Video!
    authenticatedQuery: String!
    videosByUsername(username: String!): [Video!]!
  }
  extend type Mutation {
    deleteVideo(id: String!): Boolean!
    createVideo(input: CreateVideoInput!): Video!
    # updateVideoTitle(id: String!, title: String!): Video!
    # setVideoVisibility(id: String!, visibility: VisibilityOption!): Video!
  }
  type Video {
    id: String!
    user: User!
    views: Int!
    title: String!
    duration: Float!
    createdAt: String!
    modifiedAt: String!
    visibility: String!
    thumbnails: [String]!
    versions: [Version!]!
  }
  type Version {
    link: String!
    status: String!
    preset: String!
  }
  enum VisibilityOption {
    public
    private
    unlisted
  }
  input CreateVideoInput {
    user: String!
    title: String!
  }
`;

module.exports.resolvers = {
  Video: {
    versions({ id }) {
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
    video(_, { id }) {
      return getVideoById(id);
    },
    videosByUsername(_, { username }, { isAuthenticated }) {
      return getVideosByUsername(username);
    },
  },
  Mutation: {
    deleteVideo(_, { id }) {
      return deleteVideo(id);
    },
    // updateVideoTitle(_, { id, title }) {
    //   return updateVideoTitle({
    //     id,
    //     title,
    //   });
    // },
    // setVideoVisibility(_, { id, visibility }) {
    //   return setVideoVisibility({
    //     id,
    //     visibility,
    //   });
    // },
  },
};
