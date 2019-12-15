const express = require('express');
const c = require('../controllers/uploads');

const router = express.Router();

router.get('/url', c.getUploadUrl);
router.get('/', c.createMultipartUpload);
router.post('/', c.completeMultipartUpload);

module.exports = router;
