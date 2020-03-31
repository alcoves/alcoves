const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');

const { USERS_TABLE } = require('../config/config')

const db = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

const login = async function ({ email, password }) {
  const { Items } = await db.query({
    TableName: USERS_TABLE,
    IndexName: 'email-index',
    KeyConditionExpression: '#email = :email',
    ExpressionAttributeValues: { ':email': email },
    ExpressionAttributeNames: { '#email': 'email' }
  }).promise();

  if (Items.length > 1) throw new Error('system error, email collision detected')
  if (!Items.length) throw new Error('authentication failed');

  const user = Items[0];
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) throw new Error('authentication failed');

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: '7d',
  });

  return { accessToken };
};

const register = async function ({ email, password, displayName, code }) {
  const { Items: emailCheckItems } = await db.query({
    TableName: USERS_TABLE,
    IndexName: 'email-index',
    KeyConditionExpression: '#email = :email',
    ExpressionAttributeValues: { ':email': email },
    ExpressionAttributeNames: { '#email': 'email' }
  }).promise();

  if (emailCheckItems.length) throw new Error('user already exists');
  if (code !== process.env.BETA_CODE) throw new Error('bad beta code');

  const id = shortid.generate()

  const { Item: idExists } = await db.get({
    TableName: USERS_TABLE,
    Key: { id }
  }).promise()

  if (idExists) throw new Error('userId collision!');

  await db.put({
    TableName: USERS_TABLE,
    Item: {
      id,
      email,
      displayName,
      password: await bcrypt.hash(password, 10),
    }
  }).promise()

  const { Item: user } = await db.get({
    TableName: USERS_TABLE,
    Key: { id }
  }).promise()

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: '7d',
  });

  return { accessToken };
};

module.exports = {
  login,
  register,
};
