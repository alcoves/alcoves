import db from '../../lib/db'

export const harbourResolvers = {
  Harbour: {
    channels: async ({ id }) => {
      const channels = await db.channel.findMany({ where: { harbourId: id } })
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
