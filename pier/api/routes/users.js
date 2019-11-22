const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const User = require('../models/user');

router.post('/signup', (req, res) => {
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    email: req.body.email,
    password: req.body.password,
  });

  res.status(200).send({
    payload: ['users'],
  });
});

// app.post('/user', async (req, res) => {
//   const user = new User({
//     _id: new mongoose.Types.ObjectId(),
//     displayName: 'Brendan Kennedy',
//   });

//   const userRes = await user.save();
//   res.send(userRes);
// });

module.exports = router;
