const AWS = require('aws-sdk');
// const WAWS = require('aws-sdk');

// const { WASABI_ENDPOINT } = require('./config');

// WAWS.config.update({
//   accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
//   secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
//   maxRetries: 4,
//   httpOptions: {
//     timeout: 5000,
//     connectTimeout: 3000,
//   },
// });

// const ws3 = new WAWS.S3({
//   endpoint: new WAWS.Endpoint(WASABI_ENDPOINT),
//   s3ForcePathStyle: true,
//   signatureVersion: 'v4',
// });

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
