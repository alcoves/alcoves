import { z } from 'zod'
import { db } from '../db'
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '../middlewares/auth'
import { alcoveMemberships, alcoves } from '../db/schema'

const router = new Hono()

const createAlcoveSchema = z.object({
    name: z.string(),
})

router.get('', authMiddleware, async (c) => {
    const memberships = await db.query.alcoveMemberships.findMany({
        where: eq(alcoveMemberships.userId, c.var.userId),
        with: { alcove: true },
    })

    return c.json(
        memberships.map((m) => {
            return {
                ...m.alcove,
                membership: {
                    role: m.role,
                },
            }
        })
    )
})

router.post(
    '/',
    authMiddleware,
    zValidator('json', createAlcoveSchema),
    async (c) => {
        const { name } = c.req.valid('json')

        const alcove = await db
            .insert(alcoves)
            .values({
                name,
            })
            .returning()

        await db.insert(alcoveMemberships).values({
            role: 'OWNER',
            userId: c.var.userId,
            alcoveId: alcove[0].id,
        })

        return c.json(alcove)
    }
)

export default router
