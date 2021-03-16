import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  pages: {
    newUser: null, // TODO :: Send new users to welcome page!
    signIn: '/login',
  },
  database: process.env.PG_CONNECTION_STRING,
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
    async session(session, token) { 
      // const encodedToken = jwt.sign(token, process.env.SECRET, { algorithm: 'HS256'});
      session.id = token.id;
      // session.token = encodedToken;
      return Promise.resolve(session);
    },
    async redirect(url, _) {
      if (url === '/api/auth/signin') {
        return Promise.resolve('/account')
      }
      // Send account information to bken api
      return Promise.resolve('/api/auth/signin')
    },
    async jwt(token, user, account, profile, isNewUser) {
      // Add access_token to the token right after signin      
      if (account?.accessToken) {
        token.accessToken = account.accessToken
      }
      return Promise.resolve(token)
    }
  },
})