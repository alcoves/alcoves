const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  type Query {
    hello: String!
    user: [User!]!
  }
  type User {
    id: ID!
    displayName: String!
  }
  type Mutation {
    createUser(displayName: String!): User!
  }
`;
