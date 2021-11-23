export const harbourTypeDefs = `
  input CreateHarbourInput {
    name: String!
  }

  type Harbour {
    id: ID!
    owner: User!
    name: String!
    image: String
    channels: [Channel!]!
  }

  extend type Query {
    getHarbours: [Harbour!]!
    getHarbour(id: String!): Harbour!
  }

  extend type Mutation {
    createHarbour(input: CreateHarbourInput): Harbour!
  }
`
