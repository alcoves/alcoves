const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const User = require('../model');
const { send } = require('../../../utils/mg');

async function register(_, { input: { username, password, email } }) {
  const code = nanoid(4);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await new User({ email, username, code, password: hashedPassword }).save();

  await send({
    to: email,
    template: 'account_confirmation',
    from: 'Bken <no-reply@bken.io>',
    subject: 'Activate Your bken.io Account',
    'h:X-Mailgun-Variables': JSON.stringify({ username: user.username, code }),
  });

  return true;
}

module.exports = register;