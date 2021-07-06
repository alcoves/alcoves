const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
  secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
  maxRetries: 8,
  httpOptions: {
    timeout: 5000,
    connectTimeout: 3000,
  },
});

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  endpoint: process.env.WASABI_ENDPOINT,
});

async function listObjects(params = {}, key = 'Contents', items = [] ) {
  const req = await s3.listObjectsV2(params).promise();
  req[key].map((i)=> items.push(i));
  if (req.NextContinuationToken) {
    params.ContinuationToken = req.NextContinuationToken;
    return listObjects(params, key, items);
  }
  return items;
}

async function deleteFolder(params) {
  const req = await s3.listObjectsV2(params).promise();
  await s3.deleteObjects({
    Bucket: 'cdn.bken.io',
    Delete: { Objects: req.Contents },
  }).promise();

  if (req.NextContinuationToken) {
    params.ContinuationToken = req.NextContinuationToken;
    return deleteFolder(params);
  }
}

module.exports = { s3, listObjects, deleteFolder };