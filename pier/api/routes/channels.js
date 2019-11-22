const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/:channelId', async (req, res) => {
  res.status(200).send({ message: req.params.channelId });
});

router.post('/', auth, async (req, res) => {
  res.status(200).send({ message: 'channel created' });
});

module.exports = router;
