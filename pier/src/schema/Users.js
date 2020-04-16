const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  extend type Query {
    me: User
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
    me: async (_, __, { user, users: { getUserById } }) => getUserById(user.id),
  },
  Mutation: {
    login: async (_, { input }, { res, users: { login } }) => login(input, res),
    register: async (_, { input }, { res, users: { register } }) =>
      register(input, res),
  },
};
