import dotenv from "dotenv"
dotenv.config()

import fs from 'fs-extra'
import { GraphQLServer } from 'graphql-yoga'
import mongoose, { ConnectOptions } from 'mongoose';

if (process.env.MONGODB_URI) {
  if (process.env.MONGODB_TLS_CA) {
    fs.writeFileSync("./db.crt", process.env.MONGODB_TLS_CA)
  } else {
    throw new Error("MONGODB_TLS_CA must be defined!")
  }
  
  mongoose.connect(process.env.MONGODB_URI as string, {
    tls: true,
    tlsCAFile: './db.crt',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
}

const typeDefs = `
  type Query {
    ping: String!
  }
`

const resolvers = {
  Query: {
    ping: () => "pong!",
  },
};

const server = new GraphQLServer({ typeDefs, resolvers })

export default server