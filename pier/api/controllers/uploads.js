const s3 = require('../../src/config/s3');
const Video = require('../models/video');
const convertSourceVideo = require('../../src/lib/convertSourceVideo');
const convertObjectToDotNotation = require('../../src/lib/convertObjectToDotNotation');

const {
  WASABI_ENDPOINT,
  MEDIA_BUCKET_NAME,
} = require('../../src/config/config');

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
