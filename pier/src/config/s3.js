const {
  DO_ENDPOINT,
  DO_ACCESS_KEY_ID,
  DO_SECRET_ACCESS_KEY,
  WASABI_ENDPOINT,
  WASABI_ACCESS_KEY_ID,
  WASABI_SECRET_ACCESS_KEY,
} = require('./config');

async function s3(platform = 'do') {
  const AWS = require('aws-sdk');
  let accessKeyId, secretAccessKey, endpoint;

  if (platform === 'wasabi') {
    endpoint = WASABI_ENDPOINT;
    accessKeyId = WASABI_ACCESS_KEY_ID;
    secretAccessKey = WASABI_SECRET_ACCESS_KEY;
  } else {
    endpoint = DO_ENDPOINT;
    accessKeyId = DO_ACCESS_KEY_ID;
    secretAccessKey = DO_SECRET_ACCESS_KEY;
  }

  AWS.config.update({
    credentials: new AWS.Credentials({ accessKeyId, secretAccessKey }),
    region: 'us-east-1',
    maxRetries: 4,
    httpOptions: {
      timeout: 5000,
      connectTimeout: 3000,
    },
  });

  return new AWS.S3({
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    endpoint: new AWS.Endpoint(endpoint),
  });
}

module.exports = s3;
