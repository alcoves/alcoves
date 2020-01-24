const User = require('./model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async ({ email, password, displayName, code }) => {
  const userExists = await User.find({ email });
  if (userExists.length >= 1) throw new Error('user already exists');
  if (code !== process.env.BETA_CODE) throw new Error('bad beta code');

  const user = await User({
    email,
    displayName,
    password: await bcrypt.hash(password, 10),
  }).save();

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: '7d',
  });

  return { accessToken };
};
