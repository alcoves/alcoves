const path = require('path');

exports.root = (req, res) => {
  res.status(200).send({
    message: `welcome to the api`,
  });
};

exports.favicon = (req, res) => {
  res
    .status(200)
    .sendFile(path.normalize(`${__dirname}/../../img/favicon.ico`));
};
