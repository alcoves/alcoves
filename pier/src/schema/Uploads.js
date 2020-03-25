const { gql } = require('apollo-server-express');

const typeDefs = gql`
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
    duration: Float!
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

const resolvers = {
  Mutation: {
    createMultipartUpload: async (
      _,
      { input },
      { user, uploads: { createMultipartUpload } }
    ) => {
      if (!user) throw new Error('authentication failed');
      console.log('user', user);
      return createMultipartUpload(input, user);
    },
    completeMultipartUpload: async (
      _,
      { input },
      { user, uploads: { completeMultipartUpload } }
    ) => {
      if (!user) throw new Error('authentication failed');
      return completeMultipartUpload(input);
    },
  },
};

module.exports = { typeDefs, resolvers };
