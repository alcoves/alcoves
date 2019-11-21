const Post = require('../models/post');
const Channel = require('../models/channel');

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const docs = await Post.find().select('-__v');
    res.status(200).send({ count: docs.length, payload: docs });
  } catch (error) {
    throw error;
  }
});

router.get('/:id', async (req, res) => {
  try {
    const payload = await Post.findById(req.params.id);
    payload
      ? res.status(200).send({ payload })
      : res.status(404).send({ message: 'post not found' });
  } catch (error) {
    throw error;
  }
});

router.post('/', async (req, res) => {
  try {
    const channel = await Channel.findById(req.body.channel);

    if (!channel) {
      return res.status(404).send({
        message: 'bken not found',
      });
    }

    const post = new Post({
      _id: new mongoose.Types.ObjectId(),
      channel: channel._id,
      title: req.body.title,
      authorName: req.body.authorName,
    });

    res.status(201).send({
      message: 'post created',
      payload: await post.save(),
    });
  } catch (error) {
    throw error;
  }
});

router.patch('/:id', async (req, res) => {
  const payload = await Post.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );

  res.status(200).send({
    message: 'post patched successfully',
    payload,
  });
});

router.delete('/:id', async (req, res) => {
  try {
    const payload = await Post.deleteOne({ _id: req.params.id });
    res.status(200).send({ payload });
  } catch (error) {
    throw error;
  }
});

module.exports = router;
