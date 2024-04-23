import auth from './routes/auth'
import alcoves from './routes/alcoves'

import { Hono } from 'hono'
import { db } from './db/index'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { generateSignedUrl, getUploadStorageKey } from './s3'

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

export default {
    port: 3005,
    fetch: app.fetch,
}
