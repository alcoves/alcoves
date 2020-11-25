const { gql } = require('apollo-server-express');
const me = require('./resolvers/me');
const login = require('./resolvers/login');
const register = require('./resolvers/register');
const totalViews = require('./resolvers/totalViews');
const resendCode = require('./resolvers/resendCode');
const totalVideos = require('./resolvers/totalVideos');
const uploadAvatar = require('./resolvers/uploadAvatar');
const confirmAccount = require('./resolvers/confirmAccount');

const resolvers = {
  User: {
    totalViews,
    totalVideos,
  },
  Query: {
    me,
  },
  Mutation: {
    login,
    register,
    resendCode,
    uploadAvatar,
    confirmAccount,
  },
};

const typeDefs = gql`
  extend type Query {
    me(id: String!): User!
  }
  extend type Mutation {
    login(input: LoginInput!): LoginResponse!
    register(input: RegisterInput!): Boolean!
    resendCode(input: ResendCodeInput!): Boolean!
    uploadAvatar(file: Upload!): UploadAvatarResponse!
    confirmAccount(input: ConfirmAccountInput!): Boolean!
  }
  type UploadAvatarResponse {
    url: String!
  }
  type User {
    id: String!
    email: String!
    avatar: String!
    totalViews: Int!
    totalVideos: Int!
    username: String!
  }
  type LoginResponse {
    token: String!
  }
  input LoginInput {
    username: String!
    password: String!
  }
  input ResendCodeInput {
    username: String!
  }
  input RegisterInput {
    email: String!
    password: String!
    username: String!
  }
  input ConfirmAccountInput {
    code: String!
    username: String!
  }
`;

module.exports = {
  typeDefs,
  resolvers,
};