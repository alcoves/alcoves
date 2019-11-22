const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log();
  res.status(200).send({
    message: `welcome to ${req.hostname}`,
  });
});

router.get('/favicon.ico', (req, res) => {
  res
    .status(200)
    .sendFile(path.normalize(`${__dirname}/../../img/favicon.ico`));
});

module.exports = router;
