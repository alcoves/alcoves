const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const passwordsMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (passwordsMatch) {
        const accessToken = jwt.sign(
          { email: user.email, id: user.id, userName: user.userName },
          process.env.JWT_KEY,
          { expiresIn: '7d' }
        );

        // TODO :: Add logic for refresh token

        const refreshToken = jwt.sign(
          { email: user.email, id: user.id, userName: user.userName },
          process.env.JWT_KEY,
          { expiresIn: '1d' }
        );

        res
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
          })
          .status(200)
          .send({
            message: 'login succeeded',
            accessToken,
          });
      } else {
        res.status(401).send({ message: 'authentication failed' });
      }
    } else {
      res.status(401).send({ message: 'authentication failed' });
    }
  } catch (error) {
    throw error;
  }
};
