import { createCookieSessionStorage } from '@remix-run/node'

if (!process.env.ALCOVES_CLIENT_SESSION_SECRET) {
  throw new Error(
    'The ALCOVES_CLIENT_SESSION_SECRET environment variable is required'
  )
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [process.env.ALCOVES_CLIENT_SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production' ? true : false,
    // TODO :: Add domain?
  },
})

export { sessionStorage }