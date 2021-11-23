import dotenv from 'dotenv'
dotenv.config()

import db from './lib/db'
import jwt from 'jsonwebtoken'
import { GraphQLServer, PubSub } from 'graphql-yoga'

import rootTypeDefs from './typeDefs/root'
import userTypeDefs from './typeDefs/users'
import harbourTypeDefs from './typeDefs/harbours'
import channelTypeDefs from './typeDefs/channels'
import messageTypeDefs from './typeDefs/messages'

import userResolvers from './resolvers/users'
import harbourResolvers from './resolvers/harbours'
import channelResolvers from './resolvers/channels'
import messageResolvers from './resolvers/messages'

async function main() {
  const pubsub = new PubSub()

  const server = new GraphQLServer({
    context: ({ request }) => {
      if (request?.headers?.authorization) {
        const token = request.headers.authorization.split('Bearer ')[1]
        if (token) {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '')
          if (decodedToken) {
            return { user: decodedToken, pubsub }
          }
        }
      }

      return { pubsub }
    },
    resolvers: [userResolvers, harbourResolvers, channelResolvers, messageResolvers],
    typeDefs: [rootTypeDefs, userTypeDefs, harbourTypeDefs, channelTypeDefs, messageTypeDefs],
  })

  server.start(() => console.log('Server is running on localhost:4000'))
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await db.$disconnect()
  })
