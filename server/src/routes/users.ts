import { Hono } from 'hono'
import { db } from '../db/index'
import { eq } from 'drizzle-orm'
import { users } from '../db/schema'
import { userAuth, UserAuthMiddleware } from '../middleware/auth'

const router = new Hono<{ Variables: UserAuthMiddleware }>()

router.use(userAuth)

router.get('/me', async (c) => {
    const { user } = c.get('authorization')
    const extendedUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
    })

    return c.json({ payload: extendedUser })
})

export const usersRouter = router
