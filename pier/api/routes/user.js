const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/user');

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const passwordsMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (passwordsMatch) {
        const token = jwt.sign(
          { email: user.email, userId: user.id },
          process.env.JWT_KEY,
          { expiresIn: '1h' }
        );

        res.status(200).send({
          message: 'login succeeded',
          token,
        });
      } else {
        res.status(401).send({ message: 'authentication failed' });
      }
    } else {
      res.status(401).send({ message: 'authentication failed' });
    }
  } catch (error) {
    throw error;
  }
});

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
