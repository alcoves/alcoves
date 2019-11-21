const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send({
    payload: ['users'],
  });
});

// const User = require('../models/user');

// app.post('/user', async (req, res) => {
//   const user = new User({
//     _id: new mongoose.Types.ObjectId(),
//     displayName: 'Brendan Kennedy',
//   });

//   const userRes = await user.save();
//   res.send(userRes);
// });

module.exports = router;
