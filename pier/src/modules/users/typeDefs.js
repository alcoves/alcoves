const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  extend type Mutation {
    login(input: LoginInput!): LoginResponse!
    register(input: RegisterInput!): LoginResponse!
  }
  type User {
    id: String!
    email: String!
    avatar: String!
    username: String!
  }
  type LoginResponse {
    token: String!
  }
  input LoginInput {
    username: String!
    password: String!
  }
  input RegisterInput {
    email: String!
    password: String!
    username: String!
  }
`;
