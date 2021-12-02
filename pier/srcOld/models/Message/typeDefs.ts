export const messageTypeDefs = `
  input CreateMessageInput {
    channel: String!
    content: String!
  }

  input GetChannelMessagesInput {
    before: Float
    channelId: String!
  }

  type Message {
    id: ID!
    user: User!
    channel: Channel!
    content: String!
    updatedAt: String!
    createdAt: String!
  }

  extend type Query {
    getChannelMessages(input: GetChannelMessagesInput!): [Message!]!
  }

  extend type Mutation {
    createMessage(input: CreateMessageInput!): Message!
  }

  extend type Subscription {
    channelMessages(channelId: String!): [Message!]!
  }
`
