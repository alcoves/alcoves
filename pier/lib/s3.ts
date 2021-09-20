import AWS from 'aws-sdk'

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
  secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
  maxRetries: 8,
  httpOptions: {
    timeout: 5000,
    connectTimeout: 3000,
  },
})

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  endpoint: process.env.WASABI_ENDPOINT,
})

export async function listObjects(params: AWS.S3.ListObjectsV2Request, items: AWS.S3.Object[] = []): Promise<AWS.S3.Object[]> {
  const req: AWS.S3.ListObjectsV2Output = await s3.listObjectsV2(params).promise()
  req?.Contents?.forEach((v) => {
    items.push(v)
    if (req.NextContinuationToken) {
      params.ContinuationToken = req.NextContinuationToken
      return listObjects(params, items)
    }
  })
  return items
}

export async function deleteFolder(params: AWS.S3.ListObjectsV2Request): Promise<Boolean> {
  const req: AWS.S3.ListObjectsV2Output = await s3.listObjectsV2(params).promise()
  await s3.deleteObjects({
    Bucket: 'cdn.bken.io',
    Delete: { Objects: req?.Contents?.map(({ Key }) => ({ Key })) as AWS.S3.ObjectIdentifierList },
  }).promise()

  if (req.NextContinuationToken) {
    params.ContinuationToken = req.NextContinuationToken
    return deleteFolder(params)
  }
  return true
}

export default s3