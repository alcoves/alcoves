const User = require('../models/user');
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  extend type Query {
    user(id: ID!): User!
    userVideos: [Video!]!
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
  type Avatar {
    filename: String!
    mimetype: String!
    encoding: String!
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
    user: async (_, { id }) => {
      return User.findOne({ _id: id });
    },
  },
  Mutation: {
    login: async (_, { input }, { users: { login } }) => {
      return login(input);
    },
    register: async (_, { input }, { users: { register } }) => {
      return register(input);
    },
    // uploadAvatar: async (parent, { file }) => {
    //   const { stream, filename, mimetype, encoding } = await file;

    //   console.log(file);
    //   // 1. Validate file metadata.

    //   // 2. Stream file contents into cloud storage:
    //   // https://nodejs.org/api/stream.html

    //   // 3. Record the file upload in your DB.
    //   // const id = await recordFile( … )

    //   return { filename, mimetype, encoding };
    // },
  },
};

module.exports = { typeDefs, resolvers };
