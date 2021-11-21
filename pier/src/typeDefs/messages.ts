const typeDefs = `
  input CreateMessageInput {
    channel: String!
    content: String!
  }

  type Message {
    _id: ID!
    user: User!
    channel: Channel!
    content: String!
    updatedAt: String!
    createdAt: String!
  }

  extend type Query {
    getChannelMessages(channel: String!): [Message!]!
  }

  extend type Mutation {
    createMessage(input: CreateMessageInput!): Message!
  }

  extend type Subscription {
    channelMessages: [Message!]!
  }
`

export default typeDefs
