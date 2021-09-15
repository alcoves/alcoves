import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  tls: true,
  tlsCAFile: './ca-certificate.crt',
})

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    adapter: MongoDBAdapter({
      db: (await client).db('bken'),
      ObjectId,
    }),
    pages: {
      newUser: '/studio',
      signIn: '/login',
    },
    providers: [
      Providers.Google({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        authorizationUrl:
          'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
      }),
      Providers.Discord({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async session(session, token) {
        const user = await db.user.findFirst({ where: { id: token.id } })
        session.id = token.id
        const administrators = ['ckrf389hs000101mg5s6o4nvg']
        session.user.apiKey = user.apiKey
        session.user.isAdmin = administrators.includes(token?.id)
        console.log(session)
        return session
      },
      async redirect(url) {
        if (url === '/api/auth/signin') {
          return '/'
        }
        // Send account information to bken api
        return '/api/auth/signin'
      },
    },
  })
}
