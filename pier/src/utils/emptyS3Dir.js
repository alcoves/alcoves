const AWS = require('aws-sdk');

const s3 = new AWS.S3({ region: 'us-east-2' });
const { TIDAL_BUCKET } = require('../config/config');

module.exports = async Prefix => {
  const Bucket = TIDAL_BUCKET;
  const { Contents } = await s3.listObjectsV2({ Bucket, Prefix }).promise();
  return Promise.all(
    Contents.map(({ Key }) => {
      console.log(`Deleting ${Key}`);
      return s3.deleteObject({ Bucket, Key }).promise();
    })
  );
};
