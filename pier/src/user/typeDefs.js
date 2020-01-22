const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    users: [User!]!
  }
  type Mutation {
    createUser: [User!]!
  }
  type User {
    id: ID!
    displayName: String!
  }
`;
