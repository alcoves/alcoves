const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const [, token] = req.headers.authorization.split(' ');
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
  } catch (error) {
    res.status(401).send({ message: 'authorization failed' });
  } finally {
    next();
  }
};
