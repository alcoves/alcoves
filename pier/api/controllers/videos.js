const Video = require('../models/video');

exports.getPosts = async (req, res) => {
  try {
    const docs = await Post.find().select('-__v');
    res.status(200).send({ count: docs.length, payload: docs });
  } catch (error) {
    throw error;
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

exports.deleteVideo = async (req, res) => {
  try {
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
