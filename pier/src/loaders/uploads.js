// const mime = require('mime');
// const AWS = require('aws-sdk');

// const s3 = new AWS.S3({
//   region: 'us-east-2',
//   signatureVersion: 'v4', // Uploads will fail 403 without this
// });

// const { createVideo } = require('./videos');
// const { TIDAL_BUCKET } = require('../config/config');

// const createMultipartUpload = async function (
//   { parts, fileType, duration, title },
//   user
// ) {
//   const video = await createVideo({
//     title,
//     duration,
//     user: user.sub,
//   });

//   const { UploadId, Key } = await s3
//     .createMultipartUpload({
//       Bucket: TIDAL_BUCKET,
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
//         Bucket: TIDAL_BUCKET,
//       })
//     );
//   }

//   return { objectId: video.id, urls, key: Key, uploadId: UploadId };
// };

// const completeMultipartUpload = async function ({
//   key: Key,
//   parts: Parts,
//   uploadId: UploadId,
// }) {
//   await s3
//     .completeMultipartUpload({
//       Key,
//       UploadId,
//       Bucket: TIDAL_BUCKET,
//       MultipartUpload: { Parts },
//     })
//     .promise();
//   return { completed: true };
// };

// module.exports = {
//   createMultipartUpload,
//   completeMultipartUpload,
// };
