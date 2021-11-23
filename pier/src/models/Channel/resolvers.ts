import { Types } from 'mongoose'
import { Channel } from '../models/Channel'

export const channelResolvers = {
  Mutation: {
    createChannel: async (_, { input }, { user }) => {
      if (!user) return new Error('Requires auth')
      // TODO :: check that the authenticated user can create a channel in this server
      const channel = await new Channel({
        _id: new Types.ObjectId(),
        name: input.name,
        harbour: new Types.ObjectId(input.harbourId),
      }).save()
      return channel
    },
  },
}
