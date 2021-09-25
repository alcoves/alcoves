import jwt from 'jsonwebtoken'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import DiscordProvider from 'next-auth/providers/discord'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '../../../utils/db'

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    adapter: MongoDBAdapter({
      db: (await clientPromise).db('bken'),
    }),
    pages: {
      newUser: '/studio',
      signIn: '/login',
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        authorizationUrl:
          'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
      }),
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async session({ session, user }) {
        // We create an access token that is used in the bken api to validate the requesting user
        const jwtSecret = process.env.JWT_SECRET
        const thirtySecondsAgo = Math.floor(Date.now() / 1000) - 30
        session.accessToken = jwt.sign({ id: user.id, iat: thirtySecondsAgo }, jwtSecret, {
          expiresIn: '1hr',
        })
        session.id = user.id
        // console.log('Session', session)
        return session
      },
      async redirect({ url }) {
        if (url === '/api/auth/signin') {
          return '/'
        }
        // Send account information to bken api
        return '/api/auth/signin'
      },
    },
  })
}
