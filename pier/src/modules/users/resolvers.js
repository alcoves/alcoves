const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const User = require('./model');
const { send } = require('../../utils/mg');

async function getUserById(id) {
  return User.findById(id);
}

async function login({ username, password }) {
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

async function register({ email, username, password }) {
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

const resolvers = {
  Mutation: {
    async register(_, { input }) {
      return register(input);
    },
    async login(_, { input }) {
      return login(input);
    },
    async resendCode(_, { input: { username } }) {
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
    },
    async confirmAccount(_, { input: { username, code } }) {
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
    },
  },
};

module.exports = {
  login,
  register,
  resolvers,
  getUserById,
};
