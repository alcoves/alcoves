const express = require('express');
const c = require('../controllers/videos');

const router = express.Router();

router.get('/', c.getVideos);
router.get('/:id', c.getVideo);
router.post('/', c.createVideo);
router.patch('/:id', c.updateVideo);
router.delete('/:id', c.deleteVideo);

module.exports = router;
