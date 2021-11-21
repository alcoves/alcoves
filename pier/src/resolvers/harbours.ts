import { Types } from 'mongoose'
import { Channel } from '../models/Channel'
import { Harbour } from '../models/Harbour'
import { Membership } from '../models/Membership'

const resolvers = {
  Harbour: {
    channels: async ({ _id }) => {
      const channels = await Channel.find({ harbour: _id })
      return channels
    },
  },
  Query: {
    getHarbours: async (_, __, { user }) => {
      if (!user) return new Error('Requires auth')
      const memberships = await Membership.find({ user: user.id })
        .populate('harbour')
        .sort('-createdAt')
      return memberships.map(({ harbour }) => {
        return harbour
      })
    },
    getHarbour: (_, { _id }) => {
      // TODO :: check that the user is a member of this harbour
      return Harbour.findById({ _id })
    },
  },
  Mutation: {
    createHarbour: async (_, { input }, { user }) => {
      if (!user) return new Error('Requires auth')
      // TODO :: run through transaction helper
      const harbour = await new Harbour({
        _id: new Types.ObjectId(),
        name: input.name,
      }).save()

      await new Membership({
        role: 'owner',
        _id: new Types.ObjectId(),
        user: new Types.ObjectId(user.id),
        harbour: new Types.ObjectId(harbour._id),
      }).save()

      return harbour
    },
  },
}

export default resolvers
