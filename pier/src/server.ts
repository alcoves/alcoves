import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs-extra'
import jwt from 'jsonwebtoken'
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
  context: ({ request }) => {
    if (request.headers.authorization) {
      const token = request.headers.authorization.split('Bearer ')[1]
      if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '')
        if (decodedToken) {
          // eslint-disable-next-line
          // @ts-ignore
          return { user: decodedToken }
        }
      }
    }
    return {}
  },
  resolvers: [userResolvers, harbourResolvers],
  typeDefs: [rootTypeDefs, userTypeDefs, harbourTypeDefs],
})

export default server
