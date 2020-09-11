const { gql } = require('apollo-server-express');
const { createUpload, completeUpload } = require('../loaders/uploads');

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

module.exports.resolvers = {
  Mutation: {
    async createUpload(_, { input }, { isAuthenticated }) {
      if (!isAuthenticated) throw new Error('authentication failed');
      return createUpload(input);
    },
    async completeUpload(_, { input }, { user, isAuthenticated }) {
      if (!isAuthenticated) throw new Error('authentication failed');
      return completeUpload({ user, ...input });
    },
  },
};

// createMultipartUpload(input: CreateMultipartUploadInput!): CreateMultipartUploadResponse!
// completeMultipartUpload(input: CompleteMultipartUploadInput!): CompleteMultipartUploadResponse!

// type CreateMultipartUploadResponse {
//   key: String!
//   urls: [String!]
//   uploadId: String!
//   objectId: String!
// }
// type CompleteMultipartUploadResponse {
//   completed: Boolean!
// }

// input CreateMultipartUploadInput {
//   parts: Int!
//   title: String!
//   duration: Float!
//   fileType: String!
// }
// input CompleteMultipartUploadInput {
//   parts: [Part!]!
//   key: String!
//   objectId: String!
//   uploadId: String!
// }
// input Part {
//   ETag: String!
//   PartNumber: Int!
// }

// async createMultipartUpload(_, { input }, { user, isAuthenticated }) {
//   if (!isAuthenticated) throw new Error('authentication failed');
//   return createMultipartUpload(input, user);
// },
// completeMultipartUpload: async (_, { input }, { isAuthenticated }) => {
//   if (!isAuthenticated) throw new Error('authentication failed');
//   return completeMultipartUpload(input);
// },
