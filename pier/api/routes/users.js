const express = require('express');
const c = require('../controllers/users');

const router = express.Router();

router.get('/:userId', c.getUserById);
router.get('/:userId/videos', c.getUserVideosByUserId);

module.exports = router;
