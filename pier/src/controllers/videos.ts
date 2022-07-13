import path from 'path'
import db from '../config/db'
import mime from 'mime-types'
import { io } from '..'
import { dispatchJob, parseDimensions } from '../service/tidal'
import { parseFramerate } from '../service/videos'
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

  await deleteFolder({ Bucket: cdnBucket, Prefix: `v/${video.id}` })
  await deleteFolder({ Bucket: archiveBucket, Prefix: `v/${video.id}` })
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
    if (!userOwnsVideo) return res.sendStatus(403)

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
        size: Math.round(ContentLength / 1048576), // Bytes to MB
      },
    })

    await db.video.update({
      where: { id: videoId },
      data: {
        status: 'UPLOADED',
      },
    })

    await dispatchJob('/videos/thumbnails', {
      width: 854,
      height: 480,
      fit: 'cover',
      assetId: video.id,
      input: `s3://${archiveBucket}/${video.archivePath}`,
      output: `s3://${cdnBucket}/v/${video.id}/thumbnail.webp`,
    })

    const transcodeRes = await dispatchJob('/videos/transcodes/adaptive', {
      assetId: video.id,
      output: `s3://${cdnBucket}/v/${video.id}`,
      input: `s3://${archiveBucket}/${video.archivePath}`,
    })

    const { width, height } = parseDimensions(transcodeRes?.data?.metadata)
    const length = parseFloat(transcodeRes?.data?.metadata?.format?.duration || 0)
    const framerate = parseFramerate(transcodeRes?.data?.metadata?.video[0]?.r_frame_rate || 0)

    await db.video
      .update({
        where: { id: video.id },
        data: {
          status: 'PROCESSING',
          width,
          height,
          length,
          framerate,
          metadata: transcodeRes?.data?.metadata || {},
        },
      })
      .then(video => {
        io.to(video.userId).emit('videos.update', video)
        return res.json({
          status: 'success',
          payload: video,
        })
      })
  } catch (error) {
    await db.video.update({
      where: { id: videoId },
      data: { status: 'ERROR' },
    })
  }
}
