const express = require('express');
const c = require('../controllers/jobs');

const router = express.Router();

router.post('/', c.createJob);

module.exports = router;
