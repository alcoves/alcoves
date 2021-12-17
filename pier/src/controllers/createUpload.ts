import db from '../config/db'
import mime from 'mime-types'
import s3, { defaultBucket } from '../config/s3'

export async function createUpload(req, res) {
  const { chunks, size, type, filename } = req.body

  const memberships = await db.membership.findMany({
    where: { userId: req.user.id },
    include: { pod: true },
  })

  const defaultPod = memberships.filter(membership => {
    return membership.pod.isDefault
  })[0]
  if (!defaultPod) return res.sendStatus(403)

  const media = await db.mediaItem.create({
    data: {
      size,
      type,
      url: '',
      title: filename,
      userId: req.user.id,
    },
    include: {
      user: true,
    },
  })

  await db.mediaReference.create({
    data: {
      mediaId: media.id,
      podId: defaultPod.id,
    },
  })

  const { UploadId, Key } = await s3
    .createMultipartUpload({
      Bucket: defaultBucket,
      ContentType: type,
      Key: `files/${defaultPod.id}/${media.id}/${media.id}.${mime.extension(type)}`,
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
