import { db } from '../db'
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { videos } from '../db/schema'
import { HTTPException } from 'hono/http-exception'
import { authMiddleware } from '../middlewares/auth'
import { generateSignedUrl, getUploadStorageKey } from '../utils/s3'

const router = new Hono()

router.get('/:videoId', authMiddleware, async (c) => {
    const { videoId } = c.req.param()

    const video = await db.query.videos.findFirst({
        where: eq(videos.id, parseInt(videoId)),
        with: { upload: true },
        orderBy: (videos, { desc }) => [desc(videos.createdAt)],
    })

    if (!video) throw new HTTPException(404)

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

    return c.json({
        video: {
            ...video,
            streams,
        },
    })
})

export default router
