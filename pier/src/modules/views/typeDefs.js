const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Mutation {
    viewVideo(id: String): Boolean!
  }
`;
