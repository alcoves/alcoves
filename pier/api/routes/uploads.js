const express = require('express');
const auth = require('../middleware/auth');
const c = require('../controllers/uploads');

const router = express.Router();

router.get('/url', auth, c.getUploadUrl);
router.get('/', auth, c.createMultipartUpload);
router.post('/', auth, c.completeMultipartUpload);

module.exports = router;
