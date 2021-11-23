export const channelTypeDefs = `
  input CreateChannelInput {
    name: String!
    harbourId: String!
  }

  type Channel {
    id: ID!
    name: String!
  }

  extend type Mutation {
    createChannel(input: CreateChannelInput): Channel!
  }
`
