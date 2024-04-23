import { z } from 'zod'
import { db } from '../db'
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '../middlewares/auth'
import {
    alcoveMemberships,
    alcoves,
    NewUpload,
    NewVideo,
    uploads,
    videos,
} from '../db/schema'
import {
    generatePresignedPutUrl,
    generateSignedUrl,
    getUploadStorageKey,
} from '../utils/s3'
import { HTTPException } from 'hono/http-exception'
import { transcodeQueue } from '../bullmq/bullmq'

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

router.get('/videos', async (c) => {
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

router.post('/:alcoveId/uploads', authMiddleware, async (c) => {
    const { alcoveId } = c.req.param()

    // TODO :: zod
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
        alcoveId: parseInt(alcoveId),
    }

    const newUpload = await db.insert(uploads).values(upload).returning()

    const signedUrl = await generatePresignedPutUrl(
        getUploadStorageKey(newUpload[0].storageKey, body.contentType),
        body.contentType
    )

    return c.json({
        id: newUpload[0].id,
        url: signedUrl,
    })
})

router.post(
    '/:alcoveId/uploads/:uploadId/complete',
    authMiddleware,
    async (c) => {
        const { id, alcoveId } = c.req.param()
        const upload = await db.query.uploads.findFirst({
            where: eq(uploads.id, parseInt(id)),
        })

        if (!upload) {
            throw new HTTPException(404)
        }

        if (upload.status === 'COMPLETED') {
            throw new HTTPException(400, {
                message: 'Upload already completed',
            })
        }

        await db
            .update(uploads)
            .set({ status: 'COMPLETED' })
            .where(eq(uploads.id, upload.id))

        // TODO :: Create the video record
        // Then add to the transcode queue

        const videoData: NewVideo = {
            userId: c.get('userId'),
            title: upload.filename,
            uploadId: upload.id,
            alcovesId: parseInt(alcoveId),
            storageKey: upload.storageKey,
            storageBucket: upload.storageBucket,
        }

        await db.insert(videos).values(videoData)

        await transcodeQueue.add('transcode', {
            uploadId: upload.id,
        })

        await transcodeQueue.add('thumbnail', {
            uploadId: upload.id,
        })

        return c.json({ id: upload.id })
    }
)

export default router
