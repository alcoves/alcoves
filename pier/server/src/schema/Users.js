const { gql } = require('apollo-server-lambda');

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
    user: async (_, { id }, { users: { getUserById } }) => getUserById(id),
    me: async (_, __, { user, users: { getUserById } }) =>
      getUserById(user.sub),
  },
};
