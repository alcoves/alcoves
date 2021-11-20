import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs-extra'
import { GraphQLServer } from 'graphql-yoga'
import mongoose, { ConnectOptions } from 'mongoose'

import rootTypeDefs from './typeDefs/root'
import userTypeDefs from './typeDefs/users'
import harbourTypeDefs from './typeDefs/harbours'
import userResolvers from './resolvers/users'
import harbourResolvers from './resolvers/harbours'

if (process.env.MONGODB_URI) {
  if (process.env.MONGODB_TLS_CA) {
    fs.writeFileSync('./db.crt', process.env.MONGODB_TLS_CA)
  } else {
    throw new Error('MONGODB_TLS_CA must be defined!')
  }

  mongoose.connect(
    process.env.MONGODB_URI as string,
    {
      tls: true,
      tlsCAFile: './db.crt',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  )
}

const server = new GraphQLServer({
  typeDefs: [rootTypeDefs, userTypeDefs, harbourTypeDefs],
  resolvers: [userResolvers, harbourResolvers],
})

export default server
