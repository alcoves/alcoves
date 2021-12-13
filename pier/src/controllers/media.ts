import db from '../config/db'
import mime from 'mime-types'
import s3, { defaultBucket, deleteFolder } from '../config/s3'
import { CompletedPart } from 'aws-sdk/clients/s3'
import { Prisma } from '@prisma/client'

export async function create(req, res) {
  const { chunks, podId, size, type, filename } = req.body

  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, podId },
  })
  if (!hasMembership) return res.sendStatus(403)

  const media = await db.media.create({
    data: {
      size,
      type,
      podId,
      url: '',
      title: filename,
      userId: req.user.id,
    },
    include: {
      user: true,
    },
  })

  const { UploadId, Key } = await s3
    .createMultipartUpload({
      Bucket: defaultBucket,
      ContentType: type,
      Key: `files/${podId}/${media.id}/${media.id}.${mime.extension(type)}`,
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
      media,
      upload: {
        urls,
        key: Key,
        uploadId: UploadId,
      },
    },
  })
}

export async function complete(req, res) {
  const { id, key, uploadId } = req.body

  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, podId: req.body.podId },
  })
  if (!hasMembership) return res.sendStatus(403)

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

  const media = await db.media.update({
    where: { id },
    data: {
      url: `https://${defaultBucket}/${key}`, // Replace with signed url?
    },
  })

  return res.json({
    status: 'success',
    payload: { media },
  })
}

export async function list(req, res) {
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, podId: req.query.podId },
  })
  if (!hasMembership) return res.sendStatus(403)

  const mediaParams: Prisma.MediaFindManyArgs = {
    take: 50,
    include: {
      user: {
        select: {
          id: true,
          image: true,
          username: true,
        },
      },
    },
    orderBy: [{ id: 'desc' }],
    where: { podId: req.query.podId },
  }

  if (req.query.before) {
    mediaParams.skip = 1
    mediaParams.orderBy = [{ id: 'desc' }]
    mediaParams.cursor = {
      id: parseInt(req.query.before),
    }
  }

  const media = await db.media.findMany(mediaParams)

  return res.json({
    status: 'success',
    payload: { media },
  })
}

export async function del(req, res) {
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, podId: req.body.podId },
  })
  if (!hasMembership) return res.sendStatus(403)

  await Promise.all(
    req?.body?.ids?.map(async id => {
      await deleteFolder({ Bucket: defaultBucket, Prefix: `files/${req.body.podId}/${id}` })
      await db.media.delete({ where: { id } })
    })
  )

  return res.sendStatus(200)
}
