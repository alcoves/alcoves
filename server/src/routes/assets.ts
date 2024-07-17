import { Hono } from 'hono'
import { db } from '../db/db'
import { env } from '../lib/env'
import { v4 as uuidv4 } from 'uuid'
import { and, eq } from 'drizzle-orm'
import { assets } from '../db/schema'
import { constants } from '../lib/constants'
import { generateIdFromEntropySize } from 'lucia'
import { HTTPException } from 'hono/http-exception'
import { GetObjectCommand, ListPartsCommand } from '@aws-sdk/client-s3'
import { userAuth, UserAuthMiddleware } from '../middleware/auth'
import {
    s3Client,
    getUploadPartUrl,
    createMultipartUpload,
    completeMultipartUpload,
    deleteS3ObjectsByPrefix,
} from '../lib/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const router = new Hono<{ Variables: UserAuthMiddleware }>()

router.use(userAuth)

router.delete('/:id', async (c) => {
    const { id } = c.req.param()
    const { user } = c.get('authorization')

    const asset = await db.query.assets.findFirst({
        where: and(eq(assets.userId, user.id), eq(assets.id, id)),
    })

    if (!asset) throw new HTTPException(404)

    console.info(`Deleting asset storage resources: ${id}`)
    await deleteS3ObjectsByPrefix({
        bucket: asset.storageBucket,
        prefix: asset.storageKey,
    })

    console.info(`Deleting asset db resources: ${id}`)
    await db.delete(assets).where(eq(assets.id, id))

    return c.json({ payload: null })
})

router.get('/', async (c) => {
    const { user } = c.get('authorization')

    const userAssets = await db.query.assets.findMany({
        where: eq(assets.userId, user.id),
    })

    const userAssetsWithSignedUrls = await Promise.all(
        userAssets.map(async (asset) => {
            const command = new GetObjectCommand({
                Bucket: asset.storageBucket,
                Key: asset.storageKey,
            })
            const url = await getSignedUrl(s3Client, command, {
                expiresIn: 3600,
            })

            return {
                ...asset,
                url,
            }
        })
    )

    return c.json({ payload: userAssetsWithSignedUrls })
})

router.post('/', async (c) => {
    const { size, title, contentType } = await c.req.json()
    const { user } = c.get('authorization')

    const storageUUID = uuidv4()
    const storageKey = `${constants.alcovesAssetsPrefix}/${storageUUID}/${storageUUID}`

    const uploadId = await createMultipartUpload({
        Key: storageKey,
        ContentType: contentType,
        Bucket: env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET,
    })

    const [asset] = await db
        .insert(assets)
        .values({
            id: generateIdFromEntropySize(10),
            userId: user.id,
            size,
            title,
            contentType,
            storageKey,
            storageBucket: env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET,
        })
        .returning()

    return c.json({
        payload: {
            ...asset,
            uploadId,
        },
    })
})

router.get('/:assetId/uploads/:uploadId/parts/:partId', async (c) => {
    const { assetId, uploadId, partId } = c.req.param()
    const { user } = c.get('authorization')

    const asset = await db.query.assets.findFirst({
        where: and(eq(assets.userId, user.id), eq(assets.id, assetId)),
    })

    if (!asset) throw new HTTPException(404)

    const signedUrl = await getUploadPartUrl({
        uploadId,
        key: asset.storageKey,
        bucket: asset.storageBucket,
        partNumber: Number(partId),
    })

    return c.json({ payload: signedUrl })
})

router.post('/:assetId/uploads/:uploadId', async (c) => {
    const { assetId, uploadId } = c.req.param()
    const { user } = c.get('authorization')

    const asset = await db.query.assets.findFirst({
        where: and(eq(assets.userId, user.id), eq(assets.id, assetId)),
    })

    if (!asset) throw new HTTPException(404)

    const listPartsCommand = new ListPartsCommand({
        UploadId: uploadId,
        Key: asset.storageKey,
        Bucket: asset.storageBucket,
    })

    const listedParts = await s3Client.send(listPartsCommand)

    const uploadedParts = listedParts.Parts?.map((part) => ({
        ETag: part.ETag,
        PartNumber: part.PartNumber,
    }))

    await completeMultipartUpload({
        uploadId,
        key: asset.storageKey,
        parts: uploadedParts,
        bucket: asset.storageBucket,
    })

    console.log('Multipart upload completed')
    return c.json({ payload: null })
    // Update the database and enqueue proxy jobs / metadata jobs
})

export const assetsRouter = router
