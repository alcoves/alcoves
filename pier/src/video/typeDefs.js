const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    videos: [Video!]!
    video(id: ID!): Video!
  }
  extend type Mutation {
    updateVideo(id: ID!, input: UpdateVideoInput!): Video!
    updateVideoFile(id: ID!, input: UpdateVideoFileInput!): Video!
  }
  type Video {
    id: ID!
    views: Int!
    title: String!
    user: User!
    status: String!
    thumbnail: String!
    createdAt: String!
    modifiedAt: String!
    sourceFile: String!
    files: [VideoFile!]
  }
  type VideoFile {
    link: String
    status: String!
    preset: String!
    createdAt: String
    modifiedAt: String
    percentCompleted: Float!
  }
  input UpdateVideoInput {
    title: String
    thumbnail: String
    status: String
  }
  input UpdateVideoFileInput {
    link: String
    preset: String
    status: String
    createdAt: String
    modifiedAt: String
    percentCompleted: Float
  }
`;
