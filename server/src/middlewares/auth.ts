import { db } from '../db'
import { eq } from 'drizzle-orm'
import { userSessions } from '../db/schema'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

export const authMiddleware = createMiddleware<{
    Variables: {
        userId: number
    }
}>(async (c, next) => {
    const sessionsId = c.req.header('Authorization')?.split('Bearer ')[1]
    if (!sessionsId) throw new HTTPException(401)

    const userSession = await db.query.userSessions.findFirst({
        where: eq(userSessions.id, sessionsId),
        with: { user: true },
    })
    if (!userSession) throw new HTTPException(401)

    c.set('userId', userSession.user.id)
    await next()
})
