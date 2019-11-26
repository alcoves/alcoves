const express = require('express');
const c = require('../controllers/user');

const router = express.Router();

router.post('/', c.signup);
router.post('/login', c.login);
// router.post('/refresh', c.refresh);
router.delete('/:userId', c.remove);

module.exports = router;
