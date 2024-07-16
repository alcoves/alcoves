import { Hono } from 'hono'
import { db, lucia } from '../db/db'
import { users } from '../db/schema'
import { generateIdFromEntropySize } from 'lucia'
import { HTTPException } from 'hono/http-exception'
import { getGoogleOAuthTokens, getUserInfo } from '../lib/auth'
import { getCookie } from 'hono/cookie'

const router = new Hono()

router.get('/callbacks/google', async (c) => {
    const code = c.req.query('code')
    if (!code) throw new HTTPException(400, { message: 'No code was provided' })

    const tokens = await getGoogleOAuthTokens(code)

    if (tokens?.access_token) {
        const userInfo = await getUserInfo(tokens.access_token)
        console.log('userInfo', userInfo)

        console.info('Upsering user in the database...')
        const [user] = await db
            .insert(users)
            .values({
                email: userInfo?.email,
                avatar: userInfo?.picture,
                id: generateIdFromEntropySize(10),
            })
            .onConflictDoUpdate({
                target: users.email,
                set: { email: userInfo?.email, avatar: userInfo?.picture },
            })
            .returning()

        console.log(user)

        const session = await lucia.createSession(user.id, {})
        c.header(
            'Set-Cookie',
            lucia.createSessionCookie(session.id).serialize(),
            { append: true }
        )

        // TODO :: Can the state object on the FE be used to pass the redirect URL?
        const redirectUrl =
            process.env.NODE_ENV === 'production'
                ? '/'
                : 'http://localhost:3005'
        return c.redirect(redirectUrl)
    } else {
        return c.json({
            message: 'Failed to authenticate user',
        })
    }
})

router.post('/logout', async (c) => {
    const sessionId = getCookie(c, 'auth_session')
    if (!sessionId) return c.json({ message: 'No session found' }, 204)

    const { session, user } = await lucia.validateSession(sessionId)
    if (!session || !user) throw new HTTPException(401)

    const sessionCookie = lucia.createBlankSessionCookie()
    c.header('Set-Cookie', sessionCookie.serialize(), { append: true })

    await lucia.invalidateSession(sessionId)
    await lucia.deleteExpiredSessions()

    return c.json({
        message: 'Successfully logged out',
    })
})

export const authRouter = router
