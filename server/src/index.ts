import { db } from './db'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { v4 as uuidv4 } from 'uuid'
import {
    generatePresignedPutUrl,
    generateSignedUrl,
    getUploadStorageKey,
    getVideoStorageKey,
} from './s3'

const app = new Hono()

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

    // LOGIN / REGISTER 1
    // UPLOAD VIDEO (READY) 3
    // PROCESS VIDEO 2
    // SHOW VIDEOS ON HOMEPAGE (SIMPLE YOU FUCK) 4

    return c.json({ id: upload.id })
})

app.post('/auth/register', (c) => {
    return c.json('awd')
})

app.post('/auth/login', (c) => {
    return c.json('awd')
})

export default {
    port: 3005,
    fetch: app.fetch,
}
