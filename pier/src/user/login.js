const User = require('./model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('authentication failed');
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) throw new Error('authentication failed');
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: '7d',
  });
  return { accessToken };
};
