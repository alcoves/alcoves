const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

exports.register = async (req, res) => {
  try {
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

    const user = new User({
      _id: mongoose.Types.ObjectId(),
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      userName: req.body.userName,
    });

    await user.save();

    const accessToken = jwt.sign(
      { email: user.email, id: user.id, userName: user.userName },
      process.env.JWT_KEY,
      { expiresIn: '7d' }
    );

    res.status(201).send({ message: 'registration successful', accessToken });
  } catch (error) {
    throw error;
  }
};
