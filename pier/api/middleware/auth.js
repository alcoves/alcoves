const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      if (req.headers.authorization.split(' ')[0] === 'Bearer') {
        req.user = jwt.verify(
          req.headers.authorization.split(' ')[1],
          process.env.JWT_KEY
        );
        next();
      } else if (req.headers.authorization === process.env.CONVERSION_API_KEY) {
        req.user = 'api';
        next();
      } else {
        return res.status(401).send({ message: 'authorization failed' });
      }
    } else {
      return res.status(401).send({ message: 'authorization failed' });
    }
  } catch (error) {
    return res.status(401).send({ message: 'authorization failed' });
  }
};
