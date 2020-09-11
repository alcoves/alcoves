const { gql } = require('apollo-server-express');
const { login, register } = require('../loaders/users');

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

module.exports.resolvers = {
  Mutation: {
    async register(_, { input }) {
      return register(input);
    },
    async login(_, { input }) {
      return login(input);
    },
  },
};
