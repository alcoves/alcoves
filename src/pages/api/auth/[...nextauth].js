import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from 'next-auth/adapters'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default NextAuth({
  pages: {
    newUser: null, // TODO :: Send new users to welcome page!
    signIn: '/login',
  },
  adapter: Adapters.Prisma.Adapter({ prisma }),
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
    // // Passwordless / email sign in
    // Providers.Email({
    //   server: process.env.MAIL_SERVER,
    //   from: 'NextAuth.js <no-reply@example.com>'
    // }),
  ],
  // Optional SQL or MongoDB database to persist users
  // database: process.env.DATABASE_URL
  callbacks: {
    session(session, token) { 
      // const encodedToken = jwt.sign(token, process.env.SECRET, { algorithm: 'HS256'});
      session.id = token.id;
      console.log('sessionId', session, token)
      return Promise.resolve(session);
    },
    redirect(url, _) {
      if (url === '/api/auth/signin') {
        return Promise.resolve('/account');
      }
      // Send account information to bken api
      return Promise.resolve('/api/auth/signin');
    },
    // jwt(token, user, account, profile, isNewUser) {
    //   // Add access_token to the token right after signin      
    //   if (account?.accessToken) {
    //     token.accessToken = account.accessToken;
    //   }
    //   return Promise.resolve(token);
    // },
  },
});