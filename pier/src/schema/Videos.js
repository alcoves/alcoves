const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  extend type Query {
    video(id: String!): Video!
  }
  extend type Mutation {
    deleteVideo(id: String!): Boolean!
    createVideo(input: CreateVideoInput!): Video!
  }
  type Video {
    user: ID!
    id: String!
    title: String!
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
  Query: {
    video: async (_, { id }, { videos: { getVideo } }) => {
      return getVideo(id)
    },
  },
  Mutation: {
    createVideo: async (_, { input }, { videos: { createVideo } }) => {
      return createVideo(input)
    },
    deleteVideo: async (_, { id }, { videos: { deleteVideo } }) => {
      return deleteVideo(id);
    }
  },
};