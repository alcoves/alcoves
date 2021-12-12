import cuid from 'cuid'
import s3, { defaultBucket } from '../config/s3'

export async function create(req, res) {
  const uploadId = cuid()
  const { chunks } = req.body

  const { UploadId, Key } = await s3
    .createMultipartUpload({
      Bucket: defaultBucket,
      ContentType: req.body.contentType,
      Key: `uploads/${uploadId}/original`,
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
        uploadId: uploadId, // Do we need this?
        multipartUploadId: UploadId,
      },
    },
  })
}
