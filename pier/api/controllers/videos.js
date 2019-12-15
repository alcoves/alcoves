const mongoose = require('mongoose');
const Video = require('../models/video');

exports.createVideo = async (req, res) => {
  try {
    const video = new Video({
      _id: mongoose.Types.ObjectId(),
      title: req.body.title,
    });

    await video.save();
    res.status(201).send({ message: 'video created', payload: video });
  } catch (error) {
    throw error;
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).send({
      message: 'query for video was successfull',
      payload: videos,
    });
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
    throw error;
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
    throw error;
  }
};
