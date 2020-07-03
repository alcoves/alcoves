const AWS = require('aws-sdk');

const { USERS_TABLE } = require('../config/config');

const db = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });

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

module.exports = {
  getUserById,
};
