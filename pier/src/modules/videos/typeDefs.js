const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  extend type Query {
    getRecentVideos: [Video!]!
    video(id: String!): Video!
    videosByUsername(username: String!): [Video!]!
  }

  extend type Mutation {
    deleteVideo(id: String!): Boolean!
    createVideo(input: CreateVideoInput!): Video!
    updateVideoTitle(id: String!, title: String!): Video!
    updateVideoVisibility(id: String!, visibility: VisibilityOption!): Video!
  }

  type Video {
    id: String!
    user: User!
    views: Int!
    title: String!
    duration: Float!
    tidal: TidalVideo!
    createdAt: String!
    modifiedAt: String!
    thumbnails: [String]!
    visibility: VisibilityOption!
  }

  type TidalVideo {
    status: String!
    versions: [Version!]!
  }

  type Version {
    link: String!
    status: String!
    preset: String!
    percentCompleted: Float!
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
