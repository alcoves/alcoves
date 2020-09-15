const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  extend type Mutation {
    createUpload(input: CreateUploadInput!): CreateUploadResponse!
    completeUpload(input: CompleteUploadInput!): CompleteUploadResponse!
  }
  type CreateUploadResponse {
    id: String!
    url: String!
  }
  type CompleteUploadResponse {
    id: String!
  }
  input CreateUploadInput {
    fileType: String!
  }
  input CompleteUploadInput {
    id: String!
    title: String!
    duration: Float!
    fileType: String!
  }
`;
