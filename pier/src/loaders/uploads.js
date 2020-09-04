const mime = require('mime');
const { nanoid } = require('nanoid');
const Video = require('../models/Video');

const { s3 } = require('../config/do');

const DIGITAL_OCEAN_TIDAL_BUCKET = 'bken';

// async function createMultipartUpload({ parts, fileType, duration, title }, user) {
//   const video = await createVideo({
//     title,
//     duration,
//     user: user.id,
//   });

//   const { UploadId, Key } = await s3
//     .createMultipartUpload({
//       Bucket: DIGITAL_OCEAN_TIDAL_BUCKET,
//       ContentType: mime.getType(fileType),
//       Key: `uploads/${video.id}/source.${mime.getExtension(fileType)}`,
//     })
//     .promise();

//   const urls = [];
//   for (let i = 1; i <= parts; i++) {
//     urls.push(
//       s3.getSignedUrl('uploadPart', {
//         Key,
//         UploadId,
//         PartNumber: i,
//         Expires: 43200,
//         Bucket: DIGITAL_OCEAN_TIDAL_BUCKET,
//       })
//     );
//   }

//   return { objectId: video.id, urls, key: Key, uploadId: UploadId };
// }

// async function completeMultipartUpload({ key: Key, parts: Parts, uploadId: UploadId }) {
//   await s3
//     .completeMultipartUpload({
//       Key,
//       UploadId,
//       MultipartUpload: { Parts },
//       Bucket: DIGITAL_OCEAN_TIDAL_BUCKET,
//     })
//     .promise();
//   return { completed: true };
// }

async function createUpload({ fileType }) {
  const id = nanoid();

  const url = s3.getSignedUrl('putObject', {
    Expires: 3600,
    Bucket: DIGITAL_OCEAN_TIDAL_BUCKET,
    Key: `sources/${id}/source.${mime.getExtension(fileType)}`,
  });

  return { id, url };
}

async function completeUpload({ id, title, duration, user }) {
  return new Video({
    title,
    _id: id,
    views: 0,
    duration,
    user: user.id,
    visibility: 'unlisted',
  }).save();
}

module.exports = {
  createUpload,
  completeUpload,
};
