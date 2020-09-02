const AWS = require('aws-sdk');

const { DO_ACCESS_KEY_ID, DO_SECRET_ACCESS_KEY } = process.env;

if (!DO_ACCESS_KEY_ID || !DO_SECRET_ACCESS_KEY) {
  throw new Error('Failed to setup digitalocean s3 configuration');
}

const s3 = new AWS.S3({
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  accessKeyId: DO_ACCESS_KEY_ID,
  secretAccessKey: DO_SECRET_ACCESS_KEY,
  endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
});

module.exports = {
  s3,
};
