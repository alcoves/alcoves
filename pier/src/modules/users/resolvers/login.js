const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model');

async function login(_, { input: { username, password } }) {
  const user = await User.findOne({ username });
  if (!user) throw new Error('authentication failed');
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) throw new Error('authentication failed');
  if (!user.emailVerified) throw new Error('account is not verified');

  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_KEY,
    {
      expiresIn: '7d',
    }
  );
  return { token };
}

module.exports = login;