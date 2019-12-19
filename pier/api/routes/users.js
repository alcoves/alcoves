const express = require('express');
const c = require('../controllers/users');

const router = express.Router();

router.post('/', c.register);
router.post('/login', c.login);
router.delete('/:userId', c.remove);

module.exports = router;
