const express = require('express');
const c = require('../controllers/register');

const router = express.Router();

router.post('/', c.register);

module.exports = router;
