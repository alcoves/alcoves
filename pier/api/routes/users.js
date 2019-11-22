const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/user');

router.post('/signup', async (req, res) => {
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    email: req.body.email,
    password: await bcrypt.hash(req.body.password),
  });

  await user.save();
  res.status(201).send({ message: 'user created' });
});

module.exports = router;
