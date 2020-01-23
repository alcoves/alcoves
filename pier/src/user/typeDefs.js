const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    user(id: ID!): User!
  }
  type Mutation {
    createUser(input: CreateUserInput): User!
    uploadAvatar(file: Upload!): Avatar!
  }
  type User {
    id: ID!
    followers: Int!
    avatar: String!
    email: String!
    displayName: String!
    createdAt: String
    modifiedAt: String
  }
  type Avatar {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  input CreateUserInput {
    email: String!
    password: String!
    displayName: String!
  }
`;
