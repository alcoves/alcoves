const express = require('express');
const c = require('../controllers/root');

const router = express.Router();

router.get('/', c.root);
router.get('/favicon.ico', c.favicon);

module.exports = router;
