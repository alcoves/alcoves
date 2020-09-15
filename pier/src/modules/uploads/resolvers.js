const mime = require('mime');
const { nanoid } = require('nanoid');
const ds3 = require('../../utils/ds3');
const Video = require('../videos/model');
const dispatchJob = require('../../utils/dispatchJob');

const DIGITAL_OCEAN_TIDAL_BUCKET = 'tidal';

async function createUpload({ fileType }) {
  const id = nanoid();

  const url = ds3.getSignedUrl('putObject', {
    Expires: 3600,
    Bucket: DIGITAL_OCEAN_TIDAL_BUCKET,
    Key: `${id}/source.${mime.getExtension(fileType)}`,
  });

  return { id, url };
}

async function completeUpload({ id, title, duration, user, fileType }) {
  const video = await new Video({
    title,
    _id: id,
    views: 0,
    duration,
    user: user.id,
  }).save();

  await dispatchJob('uploading', {
    s3_in: `s3://${DIGITAL_OCEAN_TIDAL_BUCKET}/${id}/source.${mime.getExtension(fileType)}`,
  });

  await dispatchJob('thumbnail', {
    s3_out: `s3://cdn.bken.io/i/${id}/t/thumb.webp`,
    cmd: '-vf scale=854:480:force_original_aspect_ratio=increase,crop=854:480 -vframes 1 -q:v 50',
    s3_in: `s3://${DIGITAL_OCEAN_TIDAL_BUCKET}/${id}/source.${mime.getExtension(fileType)}`,
  });

  return video;
}

const resolvers = {
  Mutation: {
    async createUpload(_, { input }, { isAuthenticated }) {
      if (!isAuthenticated) throw new Error('authentication failed');
      return createUpload(input);
    },
    async completeUpload(_, { input }, { user, isAuthenticated }) {
      if (!isAuthenticated) throw new Error('authentication failed');
      return completeUpload({ user, ...input });
    },
  },
};

module.exports = {
  resolvers,
  createUpload,
  completeUpload,
};
