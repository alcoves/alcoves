const express = require('express');
const auth = require('../middleware/auth');
const c = require('../controllers/me');

const router = express.Router();

router.get('/', auth, c.getMe);

module.exports = router;
