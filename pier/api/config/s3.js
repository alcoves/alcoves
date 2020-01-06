const AWS = require('aws-sdk');

const { WASABI_ENDPOINT } = require('./config');

AWS.config.update({
  accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
  secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
  maxRetries: 2,
  httpOptions: {
    timeout: 5000,
    connectTimeout: 3000,
  },
});

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(WASABI_ENDPOINT),
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

module.exports = s3;
