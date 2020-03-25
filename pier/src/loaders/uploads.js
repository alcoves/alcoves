const mime = require('mime');
const s3 = require('../config/s3');
const Video = require('../models/video');
const convertObjectToDotNotation = require('../lib/convertObjectToDotNotation');

const { UPLOAD_BUCKET_NAME } = require('../config/config');

const completeMultipartUpload = async function ({
  objectId,
  key: Key,
  parts: Parts,
  uploadId: UploadId,
}) {
  console.log('completing multipart upload');
  const data = await s3
    .completeMultipartUpload({
      Key,
      UploadId,
      Bucket: UPLOAD_BUCKET_NAME,
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

const createMultipartUpload = async function (
  { parts, fileType, duration },
  { id }
) {
  const { _id } = await Video({ user: id, duration }).save();

  const { UploadId, Key } = await s3
    .createMultipartUpload({
      ContentType: mime.getType(fileType),
      Bucket: UPLOAD_BUCKET_NAME,
      Key: `uploads/${_id}/source.${mime.getExtension(fileType)}`,
    })
    .promise();

  let urls = [];
  for (let i = 1; i <= parts; i++) {
    urls.push(
      s3.getSignedUrl('uploadPart', {
        Key,
        UploadId,
        PartNumber: i,
        Bucket: UPLOAD_BUCKET_NAME,
      })
    );
  }

  return { objectId: _id, urls, key: Key, uploadId: UploadId };
};

// const userAvatar = async function () {
//   try {
//     if (req.file.size / (1024 * 1024) > 1) {
//       return res.status(413).end();
//     }

//     console.log('file', req.file);
//     const { height, width } = await sharp(req.file.buffer).metadata();
//     let extractArea = {};

//     if (height > width) {
//       extractArea = {
//         left: 0,
//         top: parseInt((height - width) / 2),
//         width: width,
//         height: width,
//       };
//     } else {
//       extractArea = {
//         left: parseInt((width - height) / 2),
//         top: 0,
//         width: height,
//         height: height,
//       };
//     }

//     const avatarBuffer = await sharp(req.file.buffer)
//       .extract(extractArea)
//       .resize({
//         width: 300,
//         height: 300,
//       })
//       .jpeg({
//         quality: 80,
//         progressive: true,
//       })
//       .toBuffer();

//     // TODO :: Should check before possibly overwriting
//     const s3Res = await s3
//       .upload({
//         Body: avatarBuffer,
//         Bucket: MEDIA_BUCKET_NAME,
//         ContentType: 'image/jpeg',
//         Key: `avatars/${req.user.id}/avatar.jpg`,
//       })
//       .promise();

//     await User.updateOne(
//       { _id: req.user.id },
//       {
//         $set: convertObjectToDotNotation({
//           avatar: s3Res.Location,
//         }),
//       }
//     );

//     res.status(200).send({ message: 'set user avatar' });
//   } catch (error) {
//     console.error(error);
//     res.status(400).send({ message: 'bad request' });
//   }
// };

module.exports = {
  createMultipartUpload,
  completeMultipartUpload,
};
