const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

exports.register = async (req, res) => {
  const userExists = await User.find({ email: req.body.email });

  if (userExists.length >= 1) {
    return res.status(409).send({
      message: 'user already exists',
    });
  }

  if (req.body.code !== process.env.BETA_CODE) {
    return res.status(400).send({
      message: 'bad beta code',
    });
  }

  const user = await User({
    _id: mongoose.Types.ObjectId(),
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    displayName: req.body.displayName,
  }).save();

  const accessToken = jwt.sign(
    { email: user.email, id: user.id, displayName: user.displayName },
    process.env.JWT_KEY,
    { expiresIn: '7d' }
  );

  res
    .status(201)
    .send({ message: 'registration successful', accessToken, _id: user._id });
};
