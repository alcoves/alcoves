const AWS = require('aws-sdk');

const { USERS_TABLE } = require('../../config/config');

const db = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const getUserById = async function (id) {
  if (id) {
    const { Items } = await db
      .query({
        IndexName: 'id-index',
        TableName: USERS_TABLE,
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: { '#id': 'id' },
        ExpressionAttributeValues: { ':id': id },
      })
      .promise();
    return Items[0];
  }
};

module.exports = {
  getUserById,
};
