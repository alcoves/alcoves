const { gql } = require('apollo-server-express');

const typeDefs = gql`
  extend type Query {
    user(id: ID!): User!
  }
  extend type Mutation {
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

const resolvers = {
  Query: {
    user: async (_, { id }, { users: { getUser } }) => {
      return getUser(id)
    },
  },
  Mutation: {
    login: async (_, { input }, { users: { login } }) => {
      return login(input);
    },
    register: async (_, { input }, { users: { register } }) => {
      return register(input);
    },
  },
};

module.exports = { typeDefs, resolvers };
