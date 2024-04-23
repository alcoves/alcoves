import { z } from 'zod'
import { db } from '../db'
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { zValidator } from '@hono/zod-validator'
import { users, userSessions } from '../db/schema'
import { HTTPException } from 'hono/http-exception'

const router = new Hono()

router.post('/register', async (c) => {
    const {
        email,
        username,
        password,
    }: { email: string; username: string; password: string } =
        await c.req.json()

    const user = await db.query.users.findFirst({
        where: eq(users.username, username),
    })

    if (user) {
        throw new HTTPException(400)
    }

    await db.insert(users).values({
        email,
        username,
        password: await Bun.password.hash(password),
    })

    return c.json({
        status: 'success',
        message: 'User created',
    })
})

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
})

router.post('/login', zValidator('json', loginSchema), async (c) => {
    const { username, password } = c.req.valid('json')

    const user = await db.query.users.findFirst({
        where: eq(users.username, username),
    })

    if (!user) throw new HTTPException(400)
    const isPasswordValid = await Bun.password.verify(password, user.password)
    if (!isPasswordValid) throw new HTTPException(400)

    const session = await db.query.userSessions.findFirst({
        where: eq(userSessions.userId, user.id),
    })

    if (session) {
        return c.json({
            status: 'success',
            message: 'User logged in',
            session_id: session.id,
        })
    } else {
        const newSession = await db
            .insert(userSessions)
            .values({
                userId: user.id,
                userAgent: c.req.header('User-Agent'),
            })
            .returning({ id: userSessions.id })

        return c.json({
            status: 'success',
            message: 'User logged in',
            session_id: newSession[0].id,
        })
    }
})

export default router
