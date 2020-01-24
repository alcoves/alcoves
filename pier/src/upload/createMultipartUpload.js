const mime = require('mime');
const s3 = require('../config/s3');
const Video = require('../video/model');

const { MEDIA_BUCKET_NAME } = require('../config/config');

module.exports = async ({ parts, fileType }, { user }) => {
  const { _id } = await Video({ user: user.id }).save();

  const { UploadId, Key } = await s3
    .createMultipartUpload({
      ContentType: mime.getType(fileType),
      Bucket: MEDIA_BUCKET_NAME,
      Key: `videos/${_id}/source.${mime.getExtension(fileType)}`,
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

  return { objectId: _id, urls, key: Key, uploadId: UploadId };
};
