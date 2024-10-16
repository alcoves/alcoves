import { Hono } from 'hono'
import { db } from '../lib/db'
import { userAuth, UserAuthMiddleware } from '../middleware/auth'

const router = new Hono<{ Variables: UserAuthMiddleware }>()

router.use(userAuth)

router.get('/me', async (c) => {
    const { user } = c.get('authorization')

    const databaseUser = await db.user.findUnique({
        where: { id: parseInt(user.id) },
    })

    return c.json({ payload: databaseUser })
})

export const usersRouter = router
