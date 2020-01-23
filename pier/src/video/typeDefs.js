const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    videos: [Video!]!
  }
  type Video {
    id: ID!
    views: Int!
    followers: Int!
    title: String!
    avatar: String!
    email: String!
    user: String
    files: String
    status: String!
    thumbnail: String!
    displayName: String!
    createdAt: String!
    modifiedAt: String!
  }
`;
