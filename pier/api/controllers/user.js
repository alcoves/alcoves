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
          { email: user.email, userId: user.id },
          process.env.JWT_KEY,
          { expiresIn: '1h' }
        );

        // TODO :: add hashed refreshToken to database

        const refreshToken = jwt.sign(
          { email: user.email, userId: user.id },
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

exports.signup = async (req, res) => {
  try {
    const userExists = await User.find({ email: req.body.email });

    if (userExists.length >= 1) {
      return res.status(409).send({
        message: 'user already exists',
      });
    }

    const user = new User({
      _id: mongoose.Types.ObjectId(),
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    });

    await user.save();
    res.status(201).send({ message: 'user created' });
  } catch (error) {
    throw error;
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.userId });
    if (result.deletedCount >= 1) {
      res.status(200).send({ message: 'user deleted' });
    } else {
      res.status(400).send({ message: 'user was not deleted' });
    }
  } catch (error) {
    throw error;
  }
};

// exports.refresh = async (req, res) => {
//   try {
//     // TODO :: Remove log
//     console.log(req.cookies);

//     // TODO :: Match tokens with database
//     // const tokensMatch = await bcrypt.compare(
//     //   req.cookies.refreshToken,
//     //   'database.refreshToken'
//     // );

//     if (true || tokensMatch) {
//       // const accessToken = jwt.sign(
//       //   { email: user.email, userId: user.id },
//       //   process.env.JWT_KEY,
//       //   { expiresIn: '1h' }
//       // );
//       res.status(200).send({ msg: 'granted', accessToken: 'new access token' });
//     } else {
//       res.status(403).send({ msg: 'get outta dodge' });
//     }
//   } catch (error) {
//     throw error;
//   }
// };
