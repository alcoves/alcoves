const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');

const { USERS_TABLE } = require('../config/config');

const db = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const getUserById = async function (id) {
  if (id) {
    const { Item } = await db
      .get({
        Key: { id },
        TableName: USERS_TABLE,
      })
      .promise();
    return Item;
  }
};

const getUserByEmail = async function (email) {
  const { Items } = await db
    .query({
      TableName: USERS_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: '#email = :email',
      ExpressionAttributeValues: { ':email': email },
      ExpressionAttributeNames: { '#email': 'email' },
    })
    .promise();
  if (!Items.length) return null;
  if (Items.length > 1)
    throw new Error('system error, duplicate email detected');
  return Items[0];
};

const login = async function ({ email, password }, res) {
  const user = await getUserByEmail(email);
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) throw new Error('authentication failed');
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: '7d',
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
  });

  return { accessToken };
};

const logout = async function (res) {
  // When we set the cookies to 0, the user is logged out
  res.cookie('accessToken', 'removed', {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return { success: true };
};

const register = async function ({ email, password, displayName, code }, res) {
  const userEmailCheck = await getUserByEmail(email);
  if (userEmailCheck) throw new Error('email collision!');
  if (code !== process.env.BETA_CODE) throw new Error('bad beta code');

  const id = shortid.generate();
  const userIdExists = await getUserById(id);
  if (userIdExists) throw new Error('userId collision!');

  await db
    .put({
      TableName: USERS_TABLE,
      Item: {
        id,
        email,
        displayName,
        avatar: 'https://bken.io/favicon.ico',
        password: await bcrypt.hash(password, 10),
      },
    })
    .promise();

  const user = await getUserById(id);

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: '7d',
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
  });

  return { accessToken };
};

module.exports = {
  login,
  logout,
  register,
  getUserById,
  getUserByEmail,
};
