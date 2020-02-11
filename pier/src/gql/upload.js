const CreateMultipartUpload = require('../lib/createMultipartUpload');
const CompleteMultipartUpload = require('../lib/completeMultipartUpload');

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
    createMultipartUpload: async (_, { input }, ctx) => {
      if (!ctx.user) throw new Error('authentication failed');
      return CreateMultipartUpload(input, ctx);
    },
    completeMultipartUpload: async (_, { input }, ctx) => {
      if (!ctx.user) throw new Error('authentication failed');
      return CompleteMultipartUpload(input, ctx);
    },
  },
};

module.exports = { typeDefs, resolvers };
