const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const login = async function ({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('authentication failed');
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) throw new Error('authentication failed');
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: '7d',
  });
  return { accessToken };
};

const register = async function ({ email, password, displayName, code }) {
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

module.exports = {
  login,
  register,
};
