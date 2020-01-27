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
    status: String!
    thumbnail: String!
    createdAt: String!
    modifiedAt: String!
    sourceFile: String!
    hd720: VideoFile
    hd1080: VideoFile
    hd1440: VideoFile
    hd2160: VideoFile
  }
  type VideoFile {
    link: String
    status: String!
    percentCompleted: Float!
  }
  input VideoFileInput {
    link: String
    status: String
    percentCompleted: Float
  }
  input UpdateVideoInput {
    title: String
    thumbnail: String
    status: String
    hd720: VideoFileInput
    hd1080: VideoFileInput
    hd1440: VideoFileInput
    hd2160: VideoFileInput
  }
`;
