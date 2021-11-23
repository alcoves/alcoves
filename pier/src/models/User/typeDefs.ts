export const userTypeDefs = `
  input RegisterInput {
    email: String!
    username: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type User {
    id: ID!
    image: String
    email: String!
    username: String!
  }

  type AuthenticationResponse {
    accessToken: String!
  }

  extend type Query {
    ping: String!
  }

  extend type Mutation {
    login(input: LoginInput): AuthenticationResponse!
    register(input: RegisterInput): AuthenticationResponse!
  }
`
