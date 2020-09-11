const mime = require('mime');
const ds3 = require('../config/ds3');
const Video = require('../models/Video');

const { nanoid } = require('nanoid');

const DIGITAL_OCEAN_TIDAL_BUCKET = 'tidal';

// async function createMultipartUpload({ parts, fileType, duration, title }, user) {
//   const video = await createVideo({
//     title,
//     duration,
//     user: user.id,
//   });

//   const { UploadId, Key } = await ds3
//     .createMultipartUpload({
//       Bucket: DIGITAL_OCEAN_TIDAL_BUCKET,
//       ContentType: mime.getType(fileType),
//       Key: `uploads/${video.id}/source.${mime.getExtension(fileType)}`,
//     })
//     .promise();

//   const urls = [];
//   for (let i = 1; i <= parts; i++) {
//     urls.push(
//       ds3.getSignedUrl('uploadPart', {
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
//   await ds3
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

  const url = ds3.getSignedUrl('putObject', {
    Expires: 3600,
    Bucket: DIGITAL_OCEAN_TIDAL_BUCKET,
    Key: `source/${id}/source.${mime.getExtension(fileType)}`,
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

  // Dispatch upload to nomad
}

module.exports = {
  createUpload,
  completeUpload,
};
