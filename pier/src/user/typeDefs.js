const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    user(id: ID!): User!
    login(input: LoginInput!): LoginResponse!
  }
  type Mutation {
    registerUser(input: RegisterUserInput): RegisterUserResponse!
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
  type LoginResponse {
    accessToken: String!
  }
  type RegisterUserResponse {
    accessToken: String!
  }
  input RegisterUserInput {
    email: String!
    password: String!
    displayName: String!
    code: String!
  }
  input LoginInput {
    email: String!
    password: String!
  }
`;
