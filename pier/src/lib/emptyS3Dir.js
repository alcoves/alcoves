const s3 = require('../config/s3');
const { MEDIA_BUCKET_NAME } = require('../config/config');

module.exports = async (Prefix) => {
  const Bucket = MEDIA_BUCKET_NAME;
  const { Contents } = await s3.listObjectsV2({ Bucket, Prefix }).promise();
  return Promise.all(
    Contents.map(({ Key }) => {
      console.log(`Deleting ${Key}`);
      return s3.deleteObject({ Bucket, Key }).promise();
    })
  );
};
