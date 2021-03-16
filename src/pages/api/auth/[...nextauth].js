import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from 'next-auth/adapters';
import { PrismaClient, } from '@prisma/client';

const prisma = new PrismaClient();

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
  ],
  callbacks: {
    session(session, token) { 
      session.id = token.id;
      return Promise.resolve(session);
    },
    redirect(url, _) {
      if (url === '/api/auth/signin') {
        return Promise.resolve('/account');
      }
      // Send account information to bken api
      return Promise.resolve('/api/auth/signin');
    },
  },
});