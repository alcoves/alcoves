const s3 = require('../config/s3');
const Video = require('../models/video');
const convertSourceVideo = require('../lib/convertSourceVideo');
const convertObjectToDotNotation = require('../lib/convertObjectToDotNotation');

const { WASABI_ENDPOINT, MEDIA_BUCKET_NAME } = require('../config/config');

exports.getUploadUrl = async (req, res) => {
  try {
    res.send({
      message: 'created signed url',
      payload: {
        url: s3.getSignedUrl('uploadPart', {
          Bucket: MEDIA_BUCKET_NAME,
          Key: req.query.key,
          PartNumber: req.query.partNumber,
          UploadId: req.query.uploadId,
        }),
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.completeMultipartUpload = async (req, res) => {
  try {
    const data = await s3
      .completeMultipartUpload({
        Key: req.body.key,
        Bucket: MEDIA_BUCKET_NAME,
        UploadId: req.body.uploadId,
        MultipartUpload: { Parts: req.body.parts },
      })
      .promise();

    const videoId = req.body.key.split('/')[0];

    await Video.updateOne(
      { _id: req.body.key.split('/')[0] },
      {
        $set: convertObjectToDotNotation({
          status: 'queueing',
          media: {
            source: `${WASABI_ENDPOINT}/${MEDIA_BUCKET_NAME}/${req.body.key}`,
          },
        }),
      }
    );

    await convertSourceVideo({ videoId });
    res.send({ message: 'completed upload', payload: data });
  } catch (err) {
    console.log(err);
  }
};
