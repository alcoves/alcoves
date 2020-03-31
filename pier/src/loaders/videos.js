const AWS = require('aws-sdk');
const shortid = require('shortid');

const { VIDEOS_TABLE } = require('../config/config')

const db = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const getVideoVersionsById = async function (id) {
  if (id) {
    const { Items } = await db.query({
      TableName: 'tidal-dev',
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeNames: { '#id': 'id' },
      ExpressionAttributeValues: { ':id': id }
    }).promise()
    return Items
  } else {
    return []
  }
}

const getVideoById = async function (id) {
  const { Item } = await db.get({
    Key: { id },
    TableName: VIDEOS_TABLE,
  }).promise();

  if (Item) {
    return Item
  } else {
    throw new Error('video not found')
  }
}

const createVideo = async function ({ user, title, duration }) {
  const id = shortid()
  await db.put({
    TableName: VIDEOS_TABLE,
    Item: {
      id,
      user,
      title,
      views: 0,
      duration,
      thumbnail: 'test',
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      versions: []
    },
  }).promise();
  return getVideoById(id)
}

const deleteVideo = async function (id) {
  await db.delete({
    Key: { id },
    TableName: VIDEOS_TABLE,
  }).promise();
  return true
}

module.exports = {
  deleteVideo,
  createVideo,
  getVideoById,
  getVideoVersionsById
}