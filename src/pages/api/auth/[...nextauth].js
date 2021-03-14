import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
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
    redirect: async (url, _) => {
      if (url === '/api/auth/signin') {
        return Promise.resolve('/account')
      }
      return Promise.resolve('/api/auth/signin')
    },
  },
})