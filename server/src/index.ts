import auth from './routes/auth'
import alcoves from './routes/alcoves'

import { Hono } from 'hono'
import { db } from './db/index'
import { eq } from 'drizzle-orm'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { transcodeQueue } from './bullmq'
import { HTTPException } from 'hono/http-exception'
import { NewUpload, NewVideo, uploads, videos } from './db/schema'

import {
    generateSignedUrl,
    getUploadStorageKey,
    generatePresignedPutUrl,
} from './s3'
import { authMiddleware } from './middlewares/auth'

const app = new Hono()

app.use(logger())
app.use(cors())

app.get('/', (c) => {
    return c.text('HI')
})

app.get('/healthcheck', (c) => {
    return c.text('OK')
})

app.route('/auth', auth)
app.route('/alcoves', alcoves)

app.get('/videos', async (c) => {
    const videos = await db.query.videos.findMany({
        with: {
            upload: true,
        },
        orderBy: (videos, { desc }) => [desc(videos.createdAt)],
    })

    const videosWithSignedUrls = await Promise.all(
        videos.map(async (video) => {
            const streams: { url: string | undefined }[] = []

            // TODO :: Check that the video is playable
            if (video.upload) {
                streams.push({
                    url: await generateSignedUrl(
                        getUploadStorageKey(
                            video.upload.storageKey,
                            video.upload.contentType
                        )
                    ),
                })
            }

            return {
                ...video,
                streams,
            }
        })
    )

    return c.json({
        videos: videosWithSignedUrls,
    })
})

app.post('/uploads', authMiddleware, async (c) => {
    const body: { filename: string; contentType: string; size: number } =
        await c.req.json()

    const storageKey = crypto.randomUUID()
    const upload: NewUpload = {
        userId: c.get('userId'),
        size: body.size,
        storageKey: storageKey,
        storageBucket: 'alcoves',
        contentType: body.contentType,
        filename: body.filename,
    }

    const newUpload = await db.insert(uploads).values(upload).returning()
    console.log('newUpload', newUpload)

    const signedUrl = await generatePresignedPutUrl(
        getUploadStorageKey(newUpload[0].storageKey, body.contentType),
        body.contentType
    )

    return c.json({
        id: newUpload[0].id,
        url: signedUrl,
    })
})

app.post('/uploads/:id/complete', authMiddleware, async (c) => {
    const { id } = c.req.param()
    const upload = await db.query.uploads.findFirst({
        where: eq(uploads.id, parseInt(id)),
    })

    if (!upload) {
        throw new HTTPException(404)
    }

    if (upload.status === 'COMPLETED') {
        throw new HTTPException(400, { message: 'Upload already completed' })
    }

    await db
        .update(uploads)
        .set({ status: 'COMPLETED' })
        .where(eq(uploads.id, upload.id))

    // TODO :: Create the video record
    // Then add to the transcode queue

    await db.insert(videos).values({
        userId: c.get('userId'),
        title: upload.filename,
        storageKey: upload.storageKey,
        storageBucket: upload.storageBucket,
        uploadId: upload.id,
    } as NewVideo)

    await transcodeQueue.add('transcode', {
        uploadId: upload.id,
    })

    await transcodeQueue.add('thumbnail', {
        uploadId: upload.id,
    })

    return c.json({ id: upload.id })
})

export default {
    port: 3005,
    fetch: app.fetch,
}
