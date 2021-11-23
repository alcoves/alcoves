import { userTypeDefs } from './User/typeDefs'
import { channelTypeDefs } from './Channel/typeDefs'
import { harbourTypeDefs } from './Harbour/typeDefs'
import { messageTypeDefs } from './Message/typeDefs'

import { userResolvers } from './User/resolvers'
import { channelResolvers } from './Channel/resolvers'
import { harbourResolvers } from './Harbour/resolvers'
import { messageResolvers } from './Message/resolvers'

const rootTypeDefs = `
  type Query{
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`

export = {
  typeDefs: [rootTypeDefs, userTypeDefs, channelTypeDefs, harbourTypeDefs, messageTypeDefs],
  resolvers: [userResolvers, channelResolvers, harbourResolvers, messageResolvers],
}
