const express = require('express');
const c = require('../controllers/users');

const router = express.Router();

router.get('/:userId', c.getUserById);

module.exports = router;
