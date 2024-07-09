import { z } from 'zod'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { getGoogleOAuthTokens, getUserInfo } from '../lib/auth'

// import { googleAuth } from '@hono/oauth-providers/google'

const router = new Hono()

// router.use(
//     '/signup',
//     googleAuth({
//         client_id: Bun.env.GOOGLE_ID,
//         client_secret: Bun.env.GOOGLE_SECRET,
//         scope: ['openid', 'email', 'profile'],
//     })
// )

// router.get('/providers/google', (c) => {
//     const token = c.get('token')
//     const grantedScopes = c.get('granted-scopes')
//     const user = c.get('user-google')

//     return c.json({
//         token,
//         grantedScopes,
//         user,
//     })
// })

router.post(
    '/google',
    zValidator(
        'json',
        z.object({
            code: z.string(),
        })
    ),
    async (c) => {
        const { code } = c.req.valid('json')
        const tokens = await getGoogleOAuthTokens(code)

        if (tokens?.access_token) {
            const userInfo = await getUserInfo(tokens.access_token)
            console.log('userInfo', userInfo)
            return c.text('Creating an account!')
        } else {
            return c.text('Failed to get Google OAuth tokens')
        }
    }
)

// router.post('/signin', (c) => {
//     const { email, password } = c.get('body')

//     return c.json({
//         email,
//         password,
//     })
// })

export const auth = router
