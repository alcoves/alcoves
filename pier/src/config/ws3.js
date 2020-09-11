const AWS = require('aws-sdk');
const { WASABI_ENDPOINT, WASABI_ACCESS_KEY_ID, WASABI_SECRET_ACCESS_KEY } = process.env;

if (!WASABI_ENDPOINT || !WASABI_ACCESS_KEY_ID || !WASABI_SECRET_ACCESS_KEY) {
  throw new Error('Failed to setup wasabi s3 configuration');
}

const s3 = new AWS.S3({
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  accessKeyId: WASABI_ACCESS_KEY_ID,
  secretAccessKey: WASABI_SECRET_ACCESS_KEY,
  endpoint: new AWS.Endpoint(WASABI_ENDPOINT),
});

module.exports = s3;
