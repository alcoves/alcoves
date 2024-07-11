import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db, lucia } from '../db/db'
import { users } from '../db/schema'
import { getCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'

const router = new Hono()

router.get('/me', async (c) => {
    const sessionId = getCookie(c, 'auth_session')
    if (!sessionId) return c.text('No session found', 204)

    const { session, user } = await lucia.validateSession(sessionId)
    if (!session || !user) throw new HTTPException(401)

    // If Session.fresh is true, it indicates the session expiration
    // has been extended and you should set a new session cookie.
    if (session?.fresh) {
        console.info('Refreshing session...')
        const session = await lucia.createSession(user.id, {})
        c.header(
            'Set-Cookie',
            lucia.createSessionCookie(session.id).serialize(),
            { append: true }
        )
    }

    // Lucia isn't returning the full user record, so we need to query
    const extendedUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
    })

    return c.json({ payload: extendedUser })
})

export const usersRouter = router
