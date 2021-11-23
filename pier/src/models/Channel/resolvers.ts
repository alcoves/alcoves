import db from '../../lib/db'

export const channelResolvers = {
  Mutation: {
    createChannel: async (_, { input }, { user }) => {
      if (!user) return new Error('Requires auth')
      // TODO :: check that the authenticated user can create a channel in this server
      const channel = await db.channel.create({
        data: {
          name: input.name,
          harbourId: input.harbourId,
        },
      })
      return channel
    },
  },
}
