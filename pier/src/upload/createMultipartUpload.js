const mime = require('mime');
const shortId = require('shortid');
const s3 = require('../config/s3');

const { MEDIA_BUCKET_NAME } = require('../config/config');

module.exports = async ({ parts, fileType }) => {
  const objectId = shortId();

  const { UploadId, Key } = await s3
    .createMultipartUpload({
      ContentType: mime.getType(fileType),
      Bucket: MEDIA_BUCKET_NAME,
      Key: `videos/${objectId}/source.${mime.getExtension(fileType)}`,
    })
    .promise();

  let urls = [];
  for (let i = 1; i <= parts; i++) {
    urls.push(
      s3.getSignedUrl('uploadPart', {
        Key,
        UploadId,
        PartNumber: i,
        Bucket: MEDIA_BUCKET_NAME,
      })
    );
  }

  return { objectId, urls, key: Key, uploadId: UploadId };
};
