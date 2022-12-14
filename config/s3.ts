import AWS from 'aws-sdk'

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  maxRetries: 8,
  httpOptions: {
    timeout: 5000,
    connectTimeout: 3000,
  },
})

const opts: AWS.S3.ClientConfiguration = {
  signatureVersion: 'v4',
  s3ForcePathStyle: true,
}

if (process.env.AWS_ENDPOINT) {
  opts.endpoint = new AWS.Endpoint(process.env.AWS_ENDPOINT)
}

export const s3 = new AWS.S3(opts)
