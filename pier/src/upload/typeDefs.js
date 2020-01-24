const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Mutation {
    createMultipartUpload(
      input: CreateMultipartUploadInput!
    ): CreateMultipartUploadResponse!
    completeMultipartUpload(
      input: CompleteMultipartUploadInput!
    ): CompleteMultipartUploadResponse!
  }
  type CreateMultipartUploadResponse {
    key: String!
    urls: [String!]
    uploadId: String!
    objectId: String!
  }
  type CompleteMultipartUploadResponse {
    completed: Boolean!
  }
  input CreateMultipartUploadInput {
    parts: Int!
    fileType: String!
  }
  input CompleteMultipartUploadInput {
    parts: [Part!]!
    key: String!
    objectId: String!
    uploadId: String!
  }
  input Part {
    ETag: String!
    PartNumber: Int!
  }
`;
