import cuid from 'cuid'
import mime from 'mime-types'
import s3, { defaultBucket } from '../config/s3'

export async function create(req, res) {
  const { chunks } = req.body

  const { UploadId, Key } = await s3
    .createMultipartUpload({
      Bucket: defaultBucket,
      ContentType: req.body.contentType,
      Key: `uploads/${cuid()}/${cuid()}.${mime.extension(req.body.contentType)}`,
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
      upload: {
        urls,
        key: Key,
        uploadId: UploadId,
      },
    },
  })
}
