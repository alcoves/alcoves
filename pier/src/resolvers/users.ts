import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { User } from '../models/User'

let JWT_SECRET: string

if (process.env.JWT_SECRET) {
  JWT_SECRET = process.env.JWT_SECRET
} else {
  throw new Error('process.env.JWT_SECRET must be defined!')
}

function getToken(id: string, email: string, username: string): string {
  return jwt.sign({ id, email, username }, JWT_SECRET, { expiresIn: '30d' })
}

const resolvers = {
  Query: {
    ping: () => 'pong!',
  },
  Mutation: {
    login: async (_, { input: { email, password } }) => {
      const user = await User.findOne({ email })
      if (!user) throw new Error('error')

      const compare = await bcrypt.compare(password, user.password)
      if (!compare) throw new Error('error')

      return { accessToken: getToken(user._id, user.email, user.username) }
    },
    register: async (_, { input: { email, username, password } }) => {
      const userExists = await User.findOne({ email })
      if (userExists) throw new Error('error')

      const user = await new User({
        email: email,
        username: username,
        _id: new Types.ObjectId(),
        password: await bcrypt.hash(password, 10),
      }).save()

      return { accessToken: getToken(user._id, user.email, user.username) }
    },
  },
}

export default resolvers
