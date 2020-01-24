const s3 = require('../config/s3');
const Video = require('../video/model');
const { MEDIA_BUCKET_NAME } = require('../config/config');
const convertObjectToDotNotation = require('../lib/convertObjectToDotNotation');

module.exports = async ({
  objectId,
  key: Key,
  parts: Parts,
  uploadId: UploadId,
}) => {
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
        media: {
          source: data.Location.split('https://s3.us-east-2.wasabisys.com/')[1],
        },
      }),
    }
  );

  console.log('data', data);
  // await convertSourceVideo({ objectId });
  return { completed: true };
};
