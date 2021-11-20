const typeDefs = `
  input CreateHarbourInput {
    name: String!
  }

  type Harbour {
    _id: ID!
    email: String!
    username: String!
  }

  extend type Query {
    getHarbour(_id: ID!): Harbour!
  }

  extend type Mutation {
    createHarbour(input: CreateHarbourInput): Harbour!
  }
`

export default typeDefs
