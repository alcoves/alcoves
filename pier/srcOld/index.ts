import dotenv from 'dotenv'
dotenv.config()

import db from '../src/config/db'
import jwt from 'jsonwebtoken'
import { GraphQLServer, PubSub } from 'graphql-yoga'
import { typeDefs, resolvers } from './models/index'

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
    resolvers,
    typeDefs,
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
