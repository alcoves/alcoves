const typeDefs = `
  input CreateHarbourInput {
    name: String!
  }

  type Harbour {
    _id: ID!
    owner: User!
    name: String!
    image: String!
    channels: [Channel!]!
  }

  extend type Query {
    getHarbours: [Harbour!]!
    getHarbour(_id: String!): Harbour!
  }

  extend type Mutation {
    createHarbour(input: CreateHarbourInput): Harbour!
  }
`

export default typeDefs
