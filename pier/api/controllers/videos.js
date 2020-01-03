const s3 = require('../config/s3');
const mongoose = require('mongoose');
const Video = require('../models/video');
const convertObjectToDotNotation = require('../lib/convertObjectToDotNotation');

const { MEDIA_BUCKET_NAME } = require('../config/config');

const buildSourceFileKey = (id, fileType) => {
  return `${id}/source.${fileType.split('/')[1]}`;
};

const emptyS3Dir = async (Prefix) => {
  const Bucket = MEDIA_BUCKET_NAME;
  const { Contents } = await s3.listObjectsV2({ Bucket, Prefix }).promise();
  return Promise.all(
    Contents.map(({ Key }) => {
      console.log(`Deleting ${Key}`);
      return s3.deleteObject({ Bucket, Key }).promise();
    })
  );
};

exports.createMultipartUpload = async (req, res) => {
  try {
    const videoId = mongoose.Types.ObjectId();
    const video = new Video({
      status: 'uploading',
      author: req.user.id,
      title: req.body.fileName,
      _id: videoId,
      sourceFileName: req.body.fileName,
      media: { source: 'null' },
    });
    await video.save();
    const { UploadId, Key } = await s3
      .createMultipartUpload({
        Bucket: MEDIA_BUCKET_NAME,
        Key: buildSourceFileKey(video._id, req.body.fileType),
        ContentType: req.body.fileType,
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

exports.getVideos = async (req, res) => {
  try {
    res.status(200).send({
      message: 'query for videos was successfull',
      payload: await Video.find({ author: req.user.id }).sort({
        createdAt: 'descending',
      }),
    });
  } catch (error) {
    console.error(error);
    return res.status(404).send({
      message: 'not found',
    });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ _id: req.params.id });
    res.status(200).send({
      message: 'query for video was successfull',
      payload: video,
    });
  } catch (error) {
    console.error(error);
    return res.status(404).send({
      message: 'not found',
    });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const payload = await Video.updateOne(
      { _id: req.params.id },
      { $set: convertObjectToDotNotation(req.body) }
    );

    res.status(200).send({
      message: 'post patched successfully',
      payload,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    await emptyS3Dir(req.params.id);

    const result = await Video.deleteOne({ _id: req.params.id });
    if (result.deletedCount >= 1) {
      res.status(200).send({ message: 'video deleted' });
    } else {
      res.status(400).send({ message: 'video was not deleted' });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
