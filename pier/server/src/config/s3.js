const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-2',
  maxRetries: 4,
  httpOptions: {
    timeout: 5000,
    connectTimeout: 3000,
  },
});

const s3 = new AWS.S3({
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

module.exports = { s3 };
