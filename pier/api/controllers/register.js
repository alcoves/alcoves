const bcrypt = require('bcrypt');
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

    const user = new User({
      _id: mongoose.Types.ObjectId(),
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      userName: req.body.userName,
    });

    await user.save();
    res.status(201).send({ message: 'user created' });
  } catch (error) {
    throw error;
  }
};
