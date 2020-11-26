const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  extend type Query {
    myVideos: [Video!]!
    getRecentVideos: [Video!]!
    video(id: String!): Video!
    videos(title: String!): [Video!]!
    videosByUsername(username: String!): [Video!]!
  }

  extend type Mutation {
    deleteVideo(id: String!): Boolean!
    reprocessVideos(ids: [String!]!): [Video]!
    createVideo(input: CreateVideoInput!): Video!
    updateVideoTitle(input: UpdateVideoTitleInput!): Video!
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
    link: String!
    status: String!
    versions: [Version!]!
  }

  type Version {
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

  input UpdateVideoTitleInput {
    id: String!
    title: String!
  }
`;
