const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    videos: [Video!]!
    video(id: ID!): Video!
  }
  extend type Mutation {
    updateVideo(id: ID!, input: UpdateVideoInput!): Video!
  }
  type Video {
    id: ID!
    views: Int!
    title: String!
    user: String!
    files: String
    status: String!
    thumbnail: String!
    createdAt: String!
    modifiedAt: String!
    sourceFile: String!
  }
  input UpdateVideoInput {
    title: String
    thumbnail: String
    status: String
  }
`;
