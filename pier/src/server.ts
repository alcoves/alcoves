import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs-extra'
import jwt from 'jsonwebtoken'
import mongoose, { ConnectOptions } from 'mongoose'
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

if (process.env.MONGODB_URI) {
  if (process.env.MONGODB_TLS_CA) {
    fs.writeFileSync('./db.crt', process.env.MONGODB_TLS_CA)
    mongoose.connect(
      process.env.MONGODB_URI as string,
      {
        tls: true,
        tlsCAFile: './db.crt',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    )
  } else {
    mongoose.connect(
      process.env.MONGODB_URI as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    )
  }
}

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

export default server
