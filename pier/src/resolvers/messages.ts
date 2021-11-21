import { Types } from 'mongoose'
import { Message } from '../models/Message'

const resolvers = {
  Query: {
    getChannelMessages: (_, { input: { channel, skip } }, { user }) => {
      if (!user) throw new Error('Requires auth')
      return Message.find({ channel }).limit(50).skip(skip).sort('-createdAt').populate('user')
    },
  },
  Mutation: {
    createMessage: async (_, { input }, { user, pubsub }) => {
      if (!user) throw new Error('Requires auth')
      // TODO :: check that the user has the rights to add messages to channel
      if (!input.content.length) throw new Error('Message contained no content')
      const message = await new Message({
        _id: new Types.ObjectId(),
        content: input.content,
        user: new Types.ObjectId(user.id),
        channel: new Types.ObjectId(input.channel),
      }).save()

      await message.populate('user')
      pubsub.publish(input.channel, { channelMessages: message })
      return message
    },
  },
  Subscription: {
    channelMessages: {
      subscribe: (_, { channelId }, { pubsub }) => {
        return pubsub.asyncIterator(channelId)
      },
    },
  },
}

export default resolvers
