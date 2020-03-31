const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  extend type Query {
    user(id: ID!): User!
  }
  extend type Mutation {
    login(input: LoginInput!): LoginResponse!
    register(input: RegisterInput!): RegisterResponse!
  }
  type User {
    id: ID!
    email: String!
    avatar: String!
    displayName: String!
    createdAt: String
    modifiedAt: String
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

module.exports.resolvers = {
  Query: {
    user: async (_, { id }, { users: { getUserById } }) => getUserById(id),
  },
  Mutation: {
    login: async (_, { input }, { users: { login } }) => login(input),
    register: async (_, { input }, { users: { register } }) => register(input),
  },
};
