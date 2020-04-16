const AWS = require('aws-sdk');
const shortid = require('shortid');

const { VIDEOS_TABLE } = require('../config/config');

const db = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const getVideoVersionsById = async function (id) {
  if (id) {
    const { Items } = await db
      .query({
        TableName: 'tidal-dev',
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: { '#id': 'id' },
        ExpressionAttributeValues: { ':id': id },
      })
      .promise();
    return Items;
  } else {
    return [];
  }
};

const getVideoById = async function (id) {
  const { Item } = await db
    .get({
      Key: { id },
      TableName: VIDEOS_TABLE,
    })
    .promise();
  if (!Item) throw new Error('video not found');
  return Item;
};

const getVideosByUserId = async function (id) {
  const { Items } = await db
    .query({
      IndexName: 'user-index',
      TableName: VIDEOS_TABLE,
      KeyConditionExpression: '#user = :user',
      ExpressionAttributeValues: { ':user': id },
      ExpressionAttributeNames: { '#user': 'user' },
    })
    .promise();
  return Items.length ? Items : [];
};

const getVideos = async function () {
  const { Items } = await db
    .scan({
      TableName: VIDEOS_TABLE,
    })
    .promise();
  return Items.length ? Items : [];
};

const createVideo = async function ({ user, title, duration }) {
  const id = shortid();
  await db
    .put({
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
        publishingStatus: 'unlisted',
      },
    })
    .promise();
  return getVideoById(id);
};

const updateVideoTitle = async function ({ id, title }) {
  await db
    .update({
      Key: { id },
      TableName: VIDEOS_TABLE,
      UpdateExpression: 'set #title = :title',
      ExpressionAttributeValues: { ':title': title },
      ExpressionAttributeNames: { '#title': 'title' },
    })
    .promise();
  return getVideoById(id);
};

const deleteVideo = async function (id) {
  await db
    .delete({
      Key: { id },
      TableName: VIDEOS_TABLE,
    })
    .promise();
  return true;
};

module.exports = {
  getVideos,
  deleteVideo,
  createVideo,
  getVideoById,
  updateVideoTitle,
  getVideosByUserId,
  getVideoVersionsById,
};
