const { nanoid } = require('nanoid');
const User = require('../model');
const { send } = require('../../../utils/mg');

async function resendCode(_, { input: { username } }) {
  const user = await User.findOne({ username });
  if (!user.emailVerified) {
    const newCode = nanoid(4);
    user.code = newCode;
    await user.save();

    await send({
      to: user.email,
      template: 'account_confirmation',
      from: 'Bken <no-reply@bken.io>',
      subject: 'Activate Your bken.io Account',
      'h:X-Mailgun-Variables': JSON.stringify({ username: user.username, code: newCode }),
    });

    return true;
  }

  throw new Error('account is already verified');
}

module.exports = resendCode;