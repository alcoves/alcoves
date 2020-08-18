const { gql } = require('apollo-server-lambda');
const { getUserById } = require('../loaders/users');

module.exports.typeDefs = gql`
  extend type Query {
    user(id: String!): User!
  }
  type User {
    id: String!
    email: String!
    picture: String!
    nickname: String!
  }
`;

module.exports.resolvers = {
  Query: {
    async user(_, { id }) {
      return getUserById(id);
    },
  },
};
