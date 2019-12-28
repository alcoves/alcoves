const s3 = require('../config/s3');
const Video = require('../models/video');

const BUCKET_NAME = 'media-bken';

exports.getPosts = async (req, res) => {
  try {
    const docs = await Post.find().select('-__v');
    res.status(200).send({ count: docs.length, payload: docs });
  } catch (error) {
    throw error;
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).send({
      message: 'query for videos was successfull',
      payload: videos,
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
      { $set: req.body }
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

const emptyS3Dir = async (Prefix) => {
  const Bucket = BUCKET_NAME;
  const { Contents } = await s3.listObjectsV2({ Bucket, Prefix }).promise();
  return Promise.all(
    Contents.map(({ Key }) => {
      console.log(`Deleting ${Key}`);
      return s3.deleteObject({ Bucket, Key }).promise();
    })
  );
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
