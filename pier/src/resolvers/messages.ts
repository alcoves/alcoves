import { Types } from 'mongoose'
import { User } from '../../models/models'
import { Message } from '../models/Message'

// const subscribers: any = []
// const onMessageUpdates = fn => subscribers.push(fn)

const resolvers = {
  Query: {
    getChannelMessages: (_, { channel }, { user }) => {
      if (!user) throw new Error('Requires auth')
      return Message.find({ channel }).sort('-createdAt').populate('user')
    },
  },
  Mutation: {
    createMessage: async (_, { input }, { user }) => {
      if (!user) throw new Error('Requires auth')
      // TODO :: check that the user has the rights to add messages to channel
      if (!input.content.length) throw new Error('Message contained no content')
      const message = await new Message({
        _id: new Types.ObjectId(),
        content: input.content,
        user: new Types.ObjectId(user.id),
        channel: new Types.ObjectId(input.channel),
      }).save()
      return message
    },
  },
  // Subscription: {
  //   channelMessages: {
  //     subscribe: (_, { channelId }, { pubsub }) => {
  //       const channel = Math.random().toString(36).slice(2, 15)
  //       onMessageUpdates(() => pubsub.publish(channel, { messages }))
  //       setTimeout()
  //       return pubsub.asyncIterator(channelId)
  //     },
  //   },
  // },
}

export default resolvers
