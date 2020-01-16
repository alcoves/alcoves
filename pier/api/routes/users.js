const multer = require('multer');
const express = require('express');
const c = require('../controllers/users');
const auth = require('../middleware/auth');

// WARNING :: storing files in memory could cause issue during peak usage
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/:userId', c.getUserById);
router.get('/:userId/videos', c.getUserVideosByUserId);

router.post(
  '/:userId/avatars',
  [auth, upload.single('avatar')],
  c.uploadUserAvatar
);

module.exports = router;
