const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const userExists = await User.find({ email: req.body.email });

    if (userExists.length >= 1) {
      return res.status(409).send({
        message: 'user already exists',
      });
    }

    const user = new User({
      _id: mongoose.Types.ObjectId(),
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    });

    await user.save();
    res.status(201).send({ message: 'user created' });
  } catch (error) {
    throw error;
  }
});

router.delete('/:userId', async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.userId });
    if (result.deletedCount >= 1) {
      res.status(200).send({ message: 'user deleted' });
    } else {
      res.status(400).send({ message: 'user was not deleted' });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = router;
