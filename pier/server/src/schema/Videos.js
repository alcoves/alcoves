const { gql } = require('apollo-server-lambda');

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
    id: ({ id }) => id,
    views: ({ views }) => views,
    title: ({ title }) => title,
    duration: ({ duration }) => duration,
    thumbnail: async function ({ id }, _, { videos: { getTidalThumbnail } }) {
      return getTidalThumbnail(id);
    },
    createdAt: ({ createdAt }) => createdAt,
    modifiedAt: ({ modifiedAt }) => modifiedAt,
    user: function ({ user }, _, { users: { getUserById } }) {
      return getUserById(user);
    },
    versions: async function ({ id }, _, { videos: { getTidalVersions } }) {
      return getTidalVersions({ id });
    },
  },
  Query: {
    video: function (_, { id }, { videos: { getVideoById } }) {
      return getVideoById(id);
    },
    videosByUsername: function (
      _,
      { username },
      { videos: { getVideosByUsername } }
    ) {
      return getVideosByUsername(username);
    },
  },
  Mutation: {
    deleteVideo: function (_, { id }, { videos: { deleteVideo } }) {
      return deleteVideo(id);
    },
    createVideo: function (_, { input }, { videos: { createVideo } }) {
      return createVideo(input);
    },
    updateVideoTitle: function (
      _,
      { id, title },
      { videos: { updateVideoTitle } }
    ) {
      return updateVideoTitle({ id, title });
    },
    setVideoVisability: function (
      _,
      { id, visability },
      { videos: { setVideoVisability } }
    ) {
      return setVideoVisability({ id, visability });
    },
  },
};
