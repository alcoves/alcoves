const express = require('express');
const auth = require('../middleware/auth');
const c = require('../controllers/channels');

const router = express.Router();

router.get('/:channelId', c.getChannel);
router.post('/', auth, c.createChannel);

module.exports = router;
