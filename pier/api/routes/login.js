const express = require('express');
const c = require('../controllers/login');

const router = express.Router();

router.post('/', c.login);

module.exports = router;
