const express = require('express');
const auth = require('../middleware/auth');
const c = require('../controllers/followings');

const router = express.Router();

router.get('/', auth, c.getFollowings);
router.post('/', auth, c.createFollowing);
router.delete('/', auth, c.deleteFollowing);

module.exports = router;
