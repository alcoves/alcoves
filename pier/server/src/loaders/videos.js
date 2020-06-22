const _ = require('lodash');
const AWS = require('aws-sdk');
const shortid = require('shortid');
const ws3Init = require('../config/wasabi');

const { s3 } = require('../config/s3');
const {
  VIDEOS_TABLE,
  TIDAL_TABLE,
  TIDAL_BUCKET,
  WASABI_CDN_BUCKET,
} = require('../config/config');

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
  return Items.length ? _.orderBy(Items, 'createdAt', 'desc') : [];
};

const getVideos = async function () {
  const { Items } = await db
    .scan({
      TableName: VIDEOS_TABLE,
    })
    .promise();
  return Items.length ? _.orderBy(Items, 'createdAt', 'desc') : [];
};

const createVideo = async function ({ user, title, duration }) {
  const id = shortid();
  if (user && title && duration) {
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
          visability: 'unlisted',
        },
      })
      .promise();
    return getVideoById(id);
  }

  throw new Error('failed to create video');
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

const setVideoVisability = async function ({ id, visability }) {
  await db
    .update({
      Key: { id },
      TableName: VIDEOS_TABLE,
      UpdateExpression: 'set #visability = :visability',
      ExpressionAttributeValues: { ':visability': visability },
      ExpressionAttributeNames: { '#visability': 'visability' },
    })
    .promise();
  return getVideoById(id);
};

const deleteVideo = async function (id) {
  const ws3 = ws3Init();

  // Delete versions from cdn bucket
  const { Contents: cdnVideos } = await ws3
    .listObjectsV2({
      Prefix: `v/${id}`,
      Bucket: WASABI_CDN_BUCKET,
    })
    .promise();

  await Promise.all(
    cdnVideos.map(({ Key }) => {
      return ws3
        .deleteObject({
          Key,
          Bucket: WASABI_CDN_BUCKET,
        })
        .promise();
    })
  );

  // Delete thumbnails
  const { Contents: cdnThumbs } = await ws3
    .listObjectsV2({
      Prefix: `i/${id}`,
      Bucket: WASABI_CDN_BUCKET,
    })
    .promise();

  await Promise.all(
    cdnThumbs.map(({ Key }) => {
      return ws3
        .deleteObject({
          Key,
          Bucket: WASABI_CDN_BUCKET,
        })
        .promise();
    })
  );

  // Delete source video from tidal-uploads bucket
  const { Contents: tidalContents } = await s3
    .listObjectsV2({
      Prefix: `uploads/${id}`,
      Bucket: TIDAL_BUCKET,
    })
    .promise();

  await Promise.all(
    tidalContents.map(({ Key }) => {
      return s3
        .deleteObject({
          Key,
          Bucket: TIDAL_BUCKET,
        })
        .promise();
    })
  );

  // Delete from videos table
  await db
    .delete({
      Key: { id },
      TableName: VIDEOS_TABLE,
    })
    .promise();

  // Delete all versions from tidal db
  const { Items } = await db
    .query({
      TableName: TIDAL_TABLE,
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeValues: { ':id': id },
      ExpressionAttributeNames: { '#id': 'id' },
    })
    .promise();

  await Promise.all(
    Items.map(({ id, preset }) => {
      return db
        .delete({
          Key: { id, preset },
          TableName: TIDAL_TABLE,
        })
        .promise();
    })
  );

  return true;
};

module.exports = {
  getVideos,
  deleteVideo,
  createVideo,
  getVideoById,
  updateVideoTitle,
  getVideosByUserId,
  setVideoVisability,
  getVideoVersionsById,
};
