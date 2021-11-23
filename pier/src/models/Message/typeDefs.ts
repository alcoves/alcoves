export const messageTypeDefs = `
  input CreateMessageInput {
    channel: String!
    content: String!
  }

  input GetChannelInput {
    skip: Int!
    channel: String!
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
    getChannelMessages(input: GetChannelInput!): [Message!]!
  }

  extend type Mutation {
    createMessage(input: CreateMessageInput!): Message!
  }

  extend type Subscription {
    channelMessages(channelId: String!): Message!
  }
`
