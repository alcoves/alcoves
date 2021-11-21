const typeDefs = `
  type Message {
    _id: ID!
    user: String!
    channel: String!
    content: String!
  }

  extend type Query {
    getMessages: [Harbour!]!
  }

  extend type Mutation {
    createMessage(content: String): Message!
  }
`

export default typeDefs
