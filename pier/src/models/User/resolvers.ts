import db from '../../lib/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

let JWT_SECRET: string

if (process.env.JWT_SECRET) {
  JWT_SECRET = process.env.JWT_SECRET
} else {
  throw new Error('process.env.JWT_SECRET must be defined!')
}

function getToken(id: string, email: string, username: string): string {
  return jwt.sign({ id, email, username }, JWT_SECRET, { expiresIn: '30d' })
}

export const userResolvers = {
  Query: {
    ping: () => 'pong!',
  },
  Mutation: {
    login: async (_, { input: { email, password } }) => {
      const user = await db.user.findUnique({ where: { email } })
      if (!user) throw new Error('error')
      const compare = await bcrypt.compare(password, user.password)
      if (!compare) throw new Error('error')
      return { accessToken: getToken(user.id, user.email, user.username) }
    },
    register: async (_, { input: { email, username, password } }) => {
      const userExists = await db.user.findUnique({ where: { email } })
      if (userExists) throw new Error('error')

      const user = await db.user.create({
        data: {
          email,
          username,
          password: await bcrypt.hash(password, 10),
        },
      })

      return { accessToken: getToken(user.id, user.email, user.username) }
    },
  },
}
