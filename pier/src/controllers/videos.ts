import path from 'path'
import db from '../config/db'
import mime from 'mime-types'
import { io } from '..'
import { tidalVideoCreate } from '../service/tidal'
import { CompletedPart } from 'aws-sdk/clients/s3'
import s3, { cdnBucket, archiveBucket, deleteFolder } from '../config/s3'

export async function listVideos(req, res) {
  const { take, after } = req.query

  const query: any = {
    take: take || 20,
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  }

  if (after) {
    const [idCursor, createdAtCursor] = after.split('_')
    query.skip = 1
    query.cursor = {}
    query.cursor.id_createdAt = {
      id: idCursor,
      createdAt: createdAtCursor,
    }
  }

  const videos = await db.video.findMany(query)

  return res.json({ payload: videos })
}

export async function getVideo(req, res) {
  const { videoId } = req.params
  const video = await db.video.findUnique({
    where: { id: videoId },
  })
  return res.json({ payload: video })
}

export async function createVideo(req, res) {
  const { title } = req.body
  const { id: userId } = req.user
  const video = await db.video.create({
    data: {
      userId,
      title: path.parse(title).name,
    },
  })
  io.to(video.userId).emit('videos.add', video)
  return res.json({ payload: video })
}

export async function updateVideo(req, res) {
  const { title } = req.body
  const { videoId } = req.params
  const { id: userId } = req.user

  const video = await db.video.findFirst({
    where: { id: videoId, userId },
  })
  if (!video) return res.status(400).end()

  const updatedVideo = await db.video.update({
    data: { title },
    where: { id: video.id },
  })
  return res.json({ payload: updatedVideo })
}

export async function deleteVideo(req, res) {
  const { videoId } = req.params
  const { id: userId } = req.user

  const video = await db.video.findFirst({
    where: { id: videoId, userId },
  })
  if (!video) return res.status(400).end()

  await deleteFolder({ Bucket: cdnBucket, Prefix: `v/${video.id}` })
  await deleteFolder({ Bucket: archiveBucket, Prefix: `v/${video.id}` })
  await db.video.delete({ where: { id: video.id } })
  io.to(video.userId).emit('videos.remove', video.id)
  return res.status(200).end()
}

export async function createVideoUpload(req, res) {
  const { videoId } = req.params
  const { id: userId } = req.user
  const { chunks, type } = req.body

  const video = await db.video.findFirst({
    include: { user: true },
    where: { id: videoId, userId },
  })
  if (!video) return res.status(400).end()

  const archivePath = `v/${video.id}/original.${mime.extension(type)}`

  const { UploadId, Key } = await s3
    .createMultipartUpload({
      Key: archivePath,
      ContentType: type,
      Bucket: archiveBucket,
    })
    .promise()
  const urls: string[] = []
  for (let i = 0; i < chunks; i++) {
    urls.push(
      s3.getSignedUrl('uploadPart', {
        Key,
        UploadId,
        Expires: 43200,
        PartNumber: i + 1,
        Bucket: archiveBucket,
      })
    )
  }

  await db.video.update({
    where: { id: videoId },
    data: {
      type,
      archivePath,
      status: 'UPLOADING',
      cdnUrl: `https://${process.env.CDN_HOSTNAME}/v/${video.id}`,
    },
  })

  return res.json({
    payload: {
      video,
      upload: {
        urls,
        key: Key,
        uploadId: UploadId,
      },
    },
  })
}

export async function completeVideoUpload(req, res) {
  const { videoId } = req.params
  const { id: userId } = req.user
  const { key, uploadId } = req.body

  try {
    const userOwnsVideo = await db.video.findFirst({
      where: { id: videoId, userId },
    })
    if (!userOwnsVideo) return res.status(403).end()

    // TODO :: Make this work for greater than 1000 part uploads
    const { Parts } = await s3
      .listParts({
        Key: key,
        UploadId: uploadId,
        Bucket: archiveBucket,
      })
      .promise()

    const mappedParts: CompletedPart[] =
      Parts?.map(({ ETag, PartNumber }) => {
        return { ETag, PartNumber } as CompletedPart
      }) || []

    await s3
      .completeMultipartUpload({
        Key: key,
        UploadId: uploadId,
        Bucket: archiveBucket,
        MultipartUpload: { Parts: mappedParts },
      })
      .promise()

    const { ContentLength = 0 } = await s3
      .headObject({
        Key: key,
        Bucket: archiveBucket,
      })
      .promise()

    const video = await db.video.update({
      where: { id: videoId },
      data: {
        status: 'UPLOADED',
        size: Math.round(ContentLength / 1048576), // Bytes to MB
      },
    })

    // Dispatches jobs to tidal for processing
    await tidalVideoCreate(video)

    await db.video.update({
      where: { id: videoId },
      data: {
        progress: 0,
        status: 'PROCESSING',
      },
    })

    return res.json({
      status: 'success',
      payload: video,
    })
  } catch (error) {
    await db.video.update({
      where: { id: videoId },
      data: { status: 'ERROR' },
    })
  }
}
