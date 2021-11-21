const typeDefs = `
  input CreateChannelInput {
    name: String!
    harbourId: String!
  }

  type Channel {
    _id: ID!
    name: String!
  }

  extend type Mutation {
    createChannel(input: CreateChannelInput): Channel!
  }
`

export default typeDefs
