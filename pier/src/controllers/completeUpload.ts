import path from 'path'
import db from '../config/db'
import { CompletedPart } from 'aws-sdk/clients/s3'
import s3, { defaultBucket } from '../config/s3'
import { createThumbnail, getMetadata } from '../service/videos'

export async function completeUpload(req, res) {
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

  const signedVideoUrl = await s3.getSignedUrlPromise('getObject', {
    Bucket: defaultBucket,
    Key: key,
  })

  const thumbnailKey = key.replace(path.parse(key).ext, '.jpg')
  await createThumbnail(signedVideoUrl, {
    Bucket: defaultBucket,
    Key: thumbnailKey,
  })

  const metadata = await getMetadata(signedVideoUrl)

  const media = await db.mediaItem.update({
    where: { id },
    data: {
      status: 'READY',
      url: `https://${defaultBucket}/${key}`,
      thumbnailUrl: `https://${defaultBucket}/${thumbnailKey}`,
      duration: metadata.format.duration || metadata.video.duration || 0,
    },
  })

  return res.json({
    status: 'success',
    payload: { media },
  })
}
