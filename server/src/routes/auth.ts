import { Hono } from 'hono'
import { users } from '../db/schema'
import { db, lucia } from '../db/index'
import { setCookie } from 'hono/cookie'
import { generateIdFromEntropySize } from 'lucia'
import { HTTPException } from 'hono/http-exception'
import { userAuth, UserAuthMiddleware } from '../middleware/auth'
import { getGoogleOAuthTokens, getUserInfo } from '../lib/auth'

const router = new Hono<{ Variables: UserAuthMiddleware }>()

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
        const sessionCookie = lucia.createSessionCookie(session.id)
        setCookie(
            c,
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
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

router.post('/logout', userAuth, async (c) => {
    const { session } = c.get('authorization')
    await lucia.invalidateSession(session.id)

    const emptySessionCookie = lucia.createBlankSessionCookie()
    setCookie(
        c,
        emptySessionCookie.name,
        emptySessionCookie.value,
        emptySessionCookie.attributes
    )

    return c.json({
        message: 'Successfully logged out',
    })
})

export const authRouter = router
