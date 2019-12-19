const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    req.user = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWT_KEY
    );
  } catch (error) {
    return res.status(401).send({ message: 'authorization failed' });
  }
  next();
};
