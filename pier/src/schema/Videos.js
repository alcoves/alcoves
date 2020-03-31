const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  extend type Query {
    videos: [Video!]!
    video(id: String!): Video!
    videosByUserId(id: String!): [Video!]!
  }
  extend type Mutation {
    deleteVideo(id: String!): Boolean!
    createVideo(input: CreateVideoInput!): Video!
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
    versions: [VideoVersion!]
  }
  type VideoVersion {
    link: String
    status: String!
    preset: String!
    createdAt: String
    modifiedAt: String
    percentCompleted: Float!
  }
  input CreateVideoInput {
    user: ID!
    title: String!
  }
`;

module.exports.resolvers = {
  Video: {
    id: ({ id }) => id,
    views: ({ views }) => views,
    title: ({ title }) => title,
    duration: ({ duration }) => duration,
    thumbnail: ({ thumbnail }) => thumbnail,
    createdAt: ({ createdAt }) => createdAt,
    modifiedAt: ({ modifiedAt }) => modifiedAt,
    user: function ({ user }, _, { users: { getUserById } }) { return getUserById(user) },
    versions: function ({ id }, _, { videos: { getVideoVersionsById } }) { return getVideoVersionsById(id) },
  },
  Query: {
    videos: function (_, __, { videos: { getVideos } }) { return getVideos() },
    video: function (_, { id }, { videos: { getVideoById } }) { return getVideoById(id) },
    videosByUserId: function (_, { id }, { videos: { getVideosByUserId } }) { return getVideosByUserId(id) }
  },
  Mutation: {
    createVideo: function (_, { input }, { videos: { createVideo } }) { return createVideo(input) },
    deleteVideo: function (_, { id }, { videos: { deleteVideo } }) { return deleteVideo(id) }
  },
};