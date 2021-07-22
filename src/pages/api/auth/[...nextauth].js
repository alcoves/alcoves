import NextAuth from 'next-auth';
import db from '../../../utils/db';
import Providers from 'next-auth/providers';
import { PrismaAdapter, } from '@next-auth/prisma-adapter';

export default NextAuth({
  pages: {
    newUser: '/studio',
    signIn: '/login',
  },
  adapter: PrismaAdapter(db),
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session(session, token) { 
      session.id = token.id;
      const administrators = [ 'ckrf389hs000101mg5s6o4nvg' ];
      session.user.isAdmin = administrators.includes(token?.id);
      return session;
    },
    async redirect(url) {
      if (url === '/api/auth/signin') {
        return '/';
      }
      // Send account information to bken api
      return '/api/auth/signin';
    },
  },
});