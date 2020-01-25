const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    videos: [Video!]!
  }
  extend type Mutation {
    updateVideo(input: UpdateVideoInput!): Video!
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
  }
  input UpdateVideoInput {
    id: ID!
    title: String
    thumbnail: String
    status: String
  }
`;
