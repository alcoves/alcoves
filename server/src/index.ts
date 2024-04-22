import { z } from 'zod'
import { Hono } from 'hono'
import { db } from './db/index'
import { eq } from 'drizzle-orm'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { transcodeQueue } from './bullmq'
import { zValidator } from '@hono/zod-validator'
import { HTTPException } from 'hono/http-exception'
import { uploads, users, userSessions } from './db/schema'

import {
    generateSignedUrl,
    getVideoStorageKey,
    getUploadStorageKey,
    generatePresignedPutUrl,
} from './s3'

const app = new Hono()

app.use(logger())
app.use(cors())

app.get('/', (c) => {
    return c.text('HI')
})

app.get('/healthcheck', (c) => {
    return c.text('OK')
})

app.get('/videos', async (c) => {
    const videos = await db.query.videos.findMany()

    const videosWithSignedUrls = await Promise.all(
        videos.map(async (video) => {
            return {
                id: video.id,
                title: video.title,
                url: await generateSignedUrl(
                    getVideoStorageKey(video.storageKey)
                ),
            }
        })
    )

    return c.json({
        videos: videosWithSignedUrls,
    })
})

app.post('/uploads', async (c) => {
    const body: { filename: string; contentType: string; size: number } =
        await c.req.json()

    const uuid = crypto.randomUUID()
    const insertUpload = await db
        .insert(upload)
        .values({
            size: body.size,
            storageKey: uuid,
            filename: body.filename,
            storageBucket: 'alcoves',
            contentType: body.contentType,
        } as typeof upload.$inferInsert)
        .returning({ storageKey: upload.storageKey })

    const signedUrl = await generatePresignedPutUrl(
        getUploadStorageKey(insertUpload.storageKey, body.filename),
        body.contentType
    )

    return c.json({
        id: upload.id,
        url: signedUrl,
    })
})

app.post('/uploads/:id/complete', async (c) => {
    const { id } = c.req.param()
    const upload = await db.upload.findUnique({
        where: {
            id: parseInt(id),
        },
    })

    if (!upload) {
        return c.json({ error: 'Upload not found' }, 404)
    }

    await db.upload.update({
        where: {
            id: parseInt(id),
        },
        data: {
            status: 'COMPLETED',
        },
    })

    // TODO :: Create the video record
    // Then add to the transcode queue

    await transcodeQueue.add('transcode', {
        uploadId: upload.id,
    })

    await transcodeQueue.add('thumbnail', {
        uploadId: upload.id,
    })

    return c.json({ id: upload.id })
})

app.post('/auth/register', async (c) => {
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

app.post('/auth/login', zValidator('json', loginSchema), async (c) => {
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

export default {
    port: 3005,
    fetch: app.fetch,
}
