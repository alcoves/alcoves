const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const Video = require('../models/video');

const BUCKET_NAME = 'media-bken';
const WASABI_ENDPOINT = 'https://s3.us-east-2.wasabisys.com';

AWS.config.update({
  accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
  secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(WASABI_ENDPOINT),
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

const buildSourceFileKey = (id, fileType) => {
  return `${id}/source-${id}.${fileType.split('/')[1]}`;
};

exports.createMultipartUpload = async (req, res) => {
  try {
    const video = new Video({
      status: 'uploading',
      author: req.user.id,
      title: req.query.fileName,
      _id: mongoose.Types.ObjectId(),
      sourceFileName: req.query.fileName,
    });
    await video.save();
    const { UploadId, Key } = await s3
      .createMultipartUpload({
        Bucket: BUCKET_NAME,
        Key: buildSourceFileKey(video._id, req.query.fileType),
        ContentType: req.query.fileType,
      })
      .promise();

    res.status(200).send({
      message: 'started multipart upload',
      payload: {
        key: Key,
        uploadId: UploadId,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getUploadUrl = async (req, res) => {
  try {
    res.send({
      message: 'created signed url',
      payload: {
        url: s3.getSignedUrl('uploadPart', {
          Bucket: BUCKET_NAME,
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
        Bucket: BUCKET_NAME,
        UploadId: req.body.uploadId,
        MultipartUpload: { Parts: req.body.parts },
      })
      .promise();

    const videoId = req.body.key.split('/')[0];
    console.log(videoId);

    const payload = await Video.updateOne(
      { _id: req.body.key.split('/')[0] },
      {
        $set: {
          'media.source': `${WASABI_ENDPOINT}/${BUCKET_NAME}/${req.body.key}`,
          status: 'queueing',
        },
      }
    );

    console.log('payload', payload);
    res.send({ message: 'completed upload', payload: data });
  } catch (err) {
    console.log(err);
  }
};
