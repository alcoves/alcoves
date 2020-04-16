const mime = require('mime');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  region: 'us-east-1',
  signatureVersion: 'v4', // Uploads will fail 403 without this
});

const { UPLOAD_BUCKET_NAME } = require('../config/config');

const createMultipartUpload = async function (
  { parts, fileType, duration },
  user,
  createVideo
) {
  const video = await createVideo({
    duration,
    user: user.id,
    title: 'New Upload',
  });
  const { UploadId, Key } = await s3
    .createMultipartUpload({
      Bucket: UPLOAD_BUCKET_NAME,
      ContentType: mime.getType(fileType),
      Key: `uploads/${video.id}/source.${mime.getExtension(fileType)}`,
    })
    .promise();

  let urls = [];
  for (let i = 1; i <= parts; i++) {
    urls.push(
      s3.getSignedUrl('uploadPart', {
        Key,
        UploadId,
        PartNumber: i,
        Expires: 43200,
        Bucket: UPLOAD_BUCKET_NAME,
      })
    );
  }
  return { objectId: video.id, urls, key: Key, uploadId: UploadId };
};

const completeMultipartUpload = async function ({
  key: Key,
  parts: Parts,
  uploadId: UploadId,
}) {
  await s3
    .completeMultipartUpload({
      Key,
      UploadId,
      Bucket: UPLOAD_BUCKET_NAME,
      MultipartUpload: { Parts },
    })
    .promise();
  return { completed: true };
};

module.exports = {
  createMultipartUpload,
  completeMultipartUpload,
};
