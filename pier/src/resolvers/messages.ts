import { Types } from 'mongoose'
import { Message } from '../models/Message'
import { Channel } from '../models/Channel'

const resolvers = {
  Query: {
    getMessages: (_, { harbour }, { user }) => {
      if (!user) return new Error('Requires auth')
    },
  },
  Mutation: {
    createMessage: async (_, { input }, { user }) => {
      if (!user) return new Error('Requires auth')
    },
  },
}

export default resolvers
