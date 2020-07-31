const { gql } = require('apollo-server-lambda');
const { getUserById } = require('../loaders/users');

module.exports.typeDefs = gql`
  extend type Query {
    me: User!
    user(id: ID!): User!
  }
  type User {
    id: ID!
    email: String!
    avatar: String!
    username: String!
    nickname: String!
  }
`;

module.exports.resolvers = {
  Query: {
    async user(_, { id }) {
      return getUserById(id);
    },
    async me(_, __, { user }) {
      return getUserById(user.sub);
    },
  },
};
