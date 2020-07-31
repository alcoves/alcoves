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
  USERS_TABLE,
} = require('../config/config');

const db = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });

async function createVideo({ user, title, duration }) {
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
          createdAt: Date.now(),
          modifiedAt: Date.now(),
          visability: 'unlisted',
        },
      })
      .promise();
    return getVideoById(id);
  }

  throw new Error('failed to create video');
}

async function getTidalVideoById(id) {
  if (!id) throw new Error('ID cannot be null');
  const { Item } = await db
    .get({
      Key: { id },
      TableName: TIDAL_TABLE,
    })
    .promise();
  return Item;
}

async function getTidalVersions(id) {
  const video = await getTidalVideoById(id);
  if (video) {
    return Object.entries(video.versions).map(([k, v]) => {
      const percentCompleted = (v.segmentsCompleted / video.segmentCount) * 100;
      return {
        link: v.link || null,
        status: v.status || null,
        preset: v.preset || null,
        percentCompleted: isNaN(percentCompleted) ? 0 : percentCompleted,
      };
    });
  }

  return [];
}

async function getTidalThumbnail(id) {
  const video = await getTidalVideoById(id);
  if (video && video.thumbnail) return video.thumbnail;
  return 'https://cdn.bken.io/static/default-thumbnail-sm.jpg';
}

async function getVideoById(id) {
  const { Item } = await db
    .get({
      Key: { id },
      TableName: VIDEOS_TABLE,
    })
    .promise();
  if (!Item) throw new Error('video not found');
  return Item;
}

async function getVideosByUsername(username) {
  const { Items: users } = await db
    .query({
      TableName: USERS_TABLE,
      IndexName: 'username-index',
      KeyConditionExpression: '#username = :username',
      ExpressionAttributeValues: { ':username': username },
      ExpressionAttributeNames: { '#username': 'username' },
    })
    .promise();

  const { Items } = await db
    .query({
      TableName: VIDEOS_TABLE,
      IndexName: 'user-index',
      KeyConditionExpression: '#user = :user',
      ExpressionAttributeNames: { '#user': 'user' },
      ExpressionAttributeValues: { ':user': users[0].id },
    })
    .promise();

  return Items.length ? _.orderBy(Items, 'createdAt', 'desc') : [];
}

async function updateVideoTitle({ id, title }) {
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
}

async function setVideoVisability({ id, visability }) {
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
}

async function deleteVideo(id) {
  const ws3 = await ws3Init();

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

  // Delete from tidal db
  await db
    .delete({
      Key: { id },
      TableName: TIDAL_TABLE,
    })
    .promise();

  return true;
}

module.exports = {
  deleteVideo,
  createVideo,
  getVideoById,
  getTidalVersions,
  updateVideoTitle,
  getTidalThumbnail,
  setVideoVisability,
  getVideosByUsername,
};
