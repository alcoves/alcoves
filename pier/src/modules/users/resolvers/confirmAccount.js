const User = require('../model');
const { send } = require('../../../utils/mg');

async function confirmAccount(_, { input: { username, code } }) {
  const user = await User.findOne({ username });
  if (user.emailVerified) throw new Error('account is already verified');
  if (code === user.code) {
    user.emailVerified = true;
    await user.save();

    await send({
      to: user.email,
      from: 'Bken <no-reply@bken.io>',
      subject: 'Account Confirmed, Welcome!',
      text: 'Your account has been confirmed, welcome to bken.io!',
    });

    return true;
  }

  throw new Error('failed to confirm account');
}

module.exports = confirmAccount;