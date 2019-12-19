const express = require('express');
const auth = require('../middleware/auth');
const c = require('../controllers/videos');

const router = express.Router();

router.get('/:id', c.getVideo);
router.patch('/:id', auth, c.updateVideo);
router.delete('/:id', auth, c.deleteVideo);

module.exports = router;
