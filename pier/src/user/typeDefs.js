const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    user(id: ID!): User!
  }
  type Mutation {
    uploadAvatar(file: Upload!): Avatar!
    login(input: LoginInput!): LoginResponse!
    register(input: RegisterInput!): RegisterResponse!
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
  type RegisterResponse {
    accessToken: String!
  }
  input RegisterInput {
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
