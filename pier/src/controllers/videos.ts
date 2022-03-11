import path from 'path'
import db from '../config/db'
import { dispatchJob } from '../service/tidal'
import { CompletedPart } from 'aws-sdk/clients/s3'
import s3, { defaultBucket, deleteFolder } from '../config/s3'
import { io } from '..'

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
  if (!video) return res.sendStatus(400)

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
  if (!video) return res.sendStatus(400)

  await deleteFolder({ Bucket: defaultBucket, Prefix: `v/${video.id}` })
  await db.video.delete({ where: { id: video.id } })
  io.to(video.userId).emit('videos.remove', video.id)
  return res.sendStatus(200)
}

export async function createVideoUpload(req, res) {
  const { videoId } = req.params
  const { id: userId } = req.user
  const { chunks, type } = req.body

  const video = await db.video.findFirst({
    include: { user: true },
    where: { id: videoId, userId },
  })
  if (!video) return res.sendStatus(400)

  const { UploadId, Key } = await s3
    .createMultipartUpload({
      ContentType: type,
      Bucket: defaultBucket,
      Key: `v/${video.id}/original`,
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
        Bucket: defaultBucket,
      })
    )
  }

  await db.video.update({
    where: { id: videoId },
    data: {
      type,
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
    if (!userOwnsVideo) return res.sendStatus(403)

    // TODO :: Make this work for greater than 1000 part uploads
    const { Parts } = await s3
      .listParts({
        Key: key,
        UploadId: uploadId,
        Bucket: defaultBucket,
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
        Bucket: defaultBucket,
        MultipartUpload: { Parts: mappedParts },
      })
      .promise()

    const { ContentLength = 0 } = await s3
      .headObject({
        Bucket: defaultBucket,
        Key: `v/${videoId}/original`,
      })
      .promise()

    const video = await db.video.update({
      where: { id: videoId },
      data: {
        size: Math.round(ContentLength / 1048576),
      },
    })

    await db.video.update({
      where: { id: videoId },
      data: {
        status: 'UPLOADED',
      },
    })

    // Ask Tidal to generate metadata. This is an asyncronous process
    // After this. Tidal will respond via webhook as a POST /hooks/tidal/videos/:videoId
    // This webhook will contain the metadata. When the job is seen, other jobs (thumbnailing and transcoding) will be dispatched
    await dispatchJob('metadata', {
      entityId: video.id,
      input: { key, bucket: defaultBucket },
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
