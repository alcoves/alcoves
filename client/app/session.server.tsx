import { createThemeSessionResolver } from 'remix-themes'
import { createCookieSessionStorage } from '@remix-run/node'

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === 'production'

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: 'theme',
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secrets: ['debug'],
        // Set domain and secure only if in production
        ...(isProduction ? { domain: 'alcoves.io', secure: true } : {}),
    },
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
