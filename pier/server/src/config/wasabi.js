function init() {
  const AWS = require('aws-sdk');

  const { WASABI_ENDPOINT } = require('./config');
  const { WASABI_ACCESS_KEY_ID, WASABI_SECRET_ACCESS_KEY } = process.env;

  AWS.config.update({
    credentials: new AWS.Credentials({
      accessKeyId: WASABI_ACCESS_KEY_ID,
      secretAccessKey: WASABI_SECRET_ACCESS_KEY,
    }),
    region: 'us-east-2',
    maxRetries: 4,
    httpOptions: {
      timeout: 5000,
      connectTimeout: 3000,
    },
  });

  return new AWS.S3({
    endpoint: new AWS.Endpoint(WASABI_ENDPOINT),
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  });
}

module.exports = init;
