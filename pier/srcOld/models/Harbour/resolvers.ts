import db from '../../../src/config/db'

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
      const memberships = await db.membership.findMany({
        where: { userId: user.id },
        include: { harbour: true },
      })
      return memberships.map(({ harbour }) => {
        return harbour
      })
    },
    getHarbour: (_, { id }) => {
      // TODO :: check that the user is a member of this harbour
      return db.harbour.findUnique({ where: { id } })
    },
  },
  Mutation: {
    createHarbour: async (_, { input }, { user }) => {
      if (!user) return new Error('Requires auth')
      // TODO :: run through transaction helper

      const harbour = await db.harbour.create({
        data: {
          name: input.name,
        },
      })

      await db.membership.create({
        data: {
          role: 'owner',
          userId: user.id,
          harbourId: harbour.id,
        },
      })

      return harbour
    },
  },
}
