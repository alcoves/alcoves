const mime = require('mime');
const AWS = require('aws-sdk')

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
  const video = await createVideo({ duration, user: user.id, title: "New Upload" })

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
  console.log('completing multipart upload');
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
