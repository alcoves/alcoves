const typeDefs = `
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
    email: String!
    username: String!
  }

  type AuthenticationResponse {
    accessToken: String!
  }

  type Query {
    ping: String!
    login(input: LoginInput): AuthenticationResponse!
  }

  type Mutation {
    register(input: RegisterInput): AuthenticationResponse!
  }
`

export default typeDefs