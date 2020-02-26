const mime = require('mime');
const s3 = require('../config/s3');
const Video = require('../models/video');
const convertObjectToDotNotation = require('../lib/convertObjectToDotNotation');

const { MEDIA_BUCKET_NAME } = require('../config/config');

const completeMultipartUpload = async function({
  objectId,
  key: Key,
  parts: Parts,
  uploadId: UploadId,
}) {
  const data = await s3
    .completeMultipartUpload({
      Key,
      UploadId,
      Bucket: MEDIA_BUCKET_NAME,
      MultipartUpload: { Parts },
    })
    .promise();

  await Video.updateOne(
    { _id: objectId },
    {
      $set: convertObjectToDotNotation({
        status: 'queueing',
        sourceFile: data.Location.split(
          'https://s3.us-east-2.wasabisys.com/'
        )[1],
      }),
    }
  );

  // Enqueue upload in sqs
  return { completed: true };
};

const createMultipartUpload = async function(
  { parts, fileType, duration },
  { id }
) {
  const { _id } = await Video({ user: id, duration }).save();

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

module.exports = {
  createMultipartUpload,
  completeMultipartUpload,
};
