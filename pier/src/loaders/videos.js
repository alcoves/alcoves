const AWS = require('aws-sdk');
const shortid = require('shortid');

const { VIDEOS_TABLE } = require('../config/config')

const db = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const getVideo = async function (id) {
  const { Item } = await db.get({
    Key: { id },
    TableName: VIDEOS_TABLE,
  }).promise();

  const { Items } = await db.query({
    TableName: 'tidal-dev',
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: { '#id': 'id' },
    ExpressionAttributeValues: { ':id': id }
  }).promise()

  return {
    ...Item,
    versions: Items
  }
}

const createVideo = async function (input) {
  const id = shortid()
  await db.put({
    Item: { id, ...input },
    TableName: VIDEOS_TABLE,
  }).promise();
  return getVideo(id)
}

const deleteVideo = async function (id) {
  await db.delete({
    Key: { id },
    TableName: VIDEOS_TABLE,
  }).promise();
  return true
}

module.exports = {
  getVideo,
  deleteVideo,
  createVideo,
}