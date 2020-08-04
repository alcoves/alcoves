const { gql } = require('apollo-server-lambda');
const {
  createMultipartUpload,
  completeMultipartUpload,
} = require('../loaders/uploads');

module.exports.typeDefs = gql`
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
    title: String!
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

module.exports.resolvers = {
  Mutation: {
    async createMultipartUpload(_, { input }, { auth }) {
      if (!auth.isAuthenticated) throw new Error('authentication failed');
      return createMultipartUpload(input, user);
    },
    completeMultipartUpload: async (_, { input }, { auth }) => {
      if (!auth.isAuthenticated) throw new Error('authentication failed');
      return completeMultipartUpload(input);
    },
  },
};
