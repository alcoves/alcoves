const express = require('express');
const c = require('../controllers/search');

const router = express.Router();

router.get('/', c.search);

module.exports = router;
