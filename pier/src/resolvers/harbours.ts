import { Types } from 'mongoose'
import { Harbour } from '../models/Harbour'

const resolvers = {
  Query: {
    getHarbour: (_, { _id }) => {
      return Harbour.findById({ _id })
    },
  },
  Mutation: {
    createHarbour: async (_, { input: { name } }) => {
      return new Harbour({
        _id: new Types.ObjectId(),
        name,
      }).save()
    },
  },
}

export default resolvers
