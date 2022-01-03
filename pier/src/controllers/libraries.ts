import path from 'path'
import db from '../config/db'
import { CompletedPart } from 'aws-sdk/clients/s3'
import s3, { defaultBucket, deleteFolder } from '../config/s3'
import { createThumbnail, getMetadata, parseFramerate } from '../service/videos'
import { Video } from '@prisma/client'

export async function patchLibrary(req, res) {
  return res.sendStatus(200)
}

export async function listUserLibraries(req, res) {
  const libraries = await db.library.findMany({
    where: { userId: req.user.id },
  })
  if (!libraries?.length) return res.sendStatus(400)
  return res.json({
    payload: libraries,
  })
}

export async function listLibraryVideos(req, res) {
  const { libraryId } = req.params
  const videos = await db.video.findMany({
    where: { libraryId, userId: req.user.id },
  })
  return res.json({
    payload: videos,
  })
}

export async function createLibraryVideo(req, res) {
  const { libraryId } = req.params

  const userLibrary = await db.library.findFirst({
    where: { id: libraryId, userId: req.user.id },
  })
  if (!userLibrary) return res.sendStatus(400)

  const video = await db.video.create({
    data: {
      userId: req.user.id,
      libraryId: userLibrary.id,
    },
  })

  return res.json({
    payload: video,
  })
}

export async function createVideoUpload(req, res) {
  const { libraryId, videoId } = req.params
  const { chunks, type } = req.body

  const userLibrary = await db.library.findFirst({
    where: { id: libraryId, userId: req.user.id },
  })
  if (!userLibrary) return res.sendStatus(404)

  const video = await db.video.update({
    where: {
      id: videoId,
    },
    data: {
      userId: req.user.id,
      libraryId: libraryId,
    },
    include: {
      user: true,
    },
  })

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

  return res.json({
    status: 'success',
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
  const { libraryId, videoId } = req.params
  const { key, uploadId } = req.body

  const userOwnsVideo = await db.video.findFirst({
    where: { id: videoId, userId: req.params.id },
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

  const signedVideoUrl = await s3.getSignedUrlPromise('getObject', {
    Key: key,
    Bucket: defaultBucket,
  })

  const thumbnailKey = key.replace(path.parse(key).ext, '.jpg')
  await createThumbnail(signedVideoUrl, {
    Bucket: defaultBucket,
    Key: thumbnailKey,
  })

  const metadata = await getMetadata(signedVideoUrl)
  const s3HeadRes = await s3
    .headObject({
      Bucket: defaultBucket,
      Key: `v/${videoId}/original`,
    })
    .promise()

  const video = await db.video.update({
    where: { id: videoId },
    data: {
      progress: 100,
      status: 'READY',
      size: s3HeadRes.ContentLength,
      width: metadata.video.width,
      height: metadata.video.height,
      thumbnailFilename: thumbnailKey,
      framerate: parseFramerate(metadata.video.r_frame_rate),
      length: metadata.format.duration || metadata.video.duration || 0,
    },
  })

  return res.json({
    status: 'success',
    payload: video,
  })
}

export async function deleteLibraryVideos(req, res) {
  const { ids } = req.body
  const { libraryId } = req.params
  if (!ids || !libraryId) return res.sendStatus(400)

  const videosToDelete = await db.video.findMany({
    where: {
      libraryId,
      id: { in: ids },
      userId: req.user.id,
    },
  })

  await Promise.all(
    videosToDelete.map(async (v: Video) => {
      if (v.userId === req.user.id && v.libraryId === libraryId) {
        await db.video.delete({ where: { id: v.id } })
        await deleteFolder({ Bucket: defaultBucket, Prefix: `v/${v.id}` })
      }
    })
  )

  return res.sendStatus(200)
}
