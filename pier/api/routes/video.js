const express = require('express');
const c = require('../controllers/video');

const router = express.Router();

router.get('/', c.get);
router.post('/login', c.upload);
router.delete('/:userId', c.delete);

module.exports = router;
