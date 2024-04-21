import './bullmq'
import { db } from './db'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { v4 as uuidv4 } from 'uuid'
import { HTTPException } from 'hono/http-exception'
import {
    generatePresignedPutUrl,
    generateSignedUrl,
    getUploadStorageKey,
    getVideoStorageKey,
} from './s3'
import { transcodeQueue } from './bullmq'

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
    const videos = await db.video.findMany()

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

    const uuid = uuidv4()
    const upload = await db.upload.create({
        data: {
            size: body.size,
            storageKey: uuid,
            filename: body.filename,
            storageBucket: 'alcoves',
            contentType: body.contentType,
        },
    })

    const signedUrl = await generatePresignedPutUrl(
        getUploadStorageKey(upload.storageKey, body.filename),
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
        await c.req.parseBody()

    const user = await db.user.findUnique({
        where: {
            email: email,
        },
    })

    if (user) {
        throw new HTTPException(400)
    }

    await db.user.create({
        data: {
            email,
            username,
            password: await Bun.password.hash(password),
        },
    })

    return c.json({
        status: 'success',
        message: 'User created',
    })
})

app.post('/auth/login', async (c) => {
    const { username, password }: { username: string; password: string } =
        await c.req.parseBody()

    const user = await db.user.findUnique({
        where: {
            username: username,
        },
    })

    if (!user) {
        throw new HTTPException(400)
    }

    const isPasswordValid = await Bun.password.verify(password, user.password)
    if (!isPasswordValid) {
        throw new HTTPException(400)
    }

    const session = await db.userSession.findFirst({
        where: {
            userId: user.id,
        },
    })

    if (session) {
        return c.json({
            status: 'success',
            message: 'User logged in',
            session_id: session.id,
        })
    } else {
        await db.userSession.create({
            data: {
                userId: user.id,
            },
        })
    }

    return c.json({
        status: 'success',
        message: 'User logged in',
        session_id: user.id,
    })
})

export default {
    port: 3005,
    fetch: app.fetch,
}
