const _ = require('lodash');
const ds3 = require('../config/ds3');
const ws3 = require('../config/ws3');
const User = require('../models/User');
const Video = require('../models/Video');

function getVideoById(id) {
  return Video.findById(id);
}

async function getTidalThumbnailsById(id) {
  const res = await ws3.listObjectsV2({ Bucket: 'cdn.bken.io', Prefix: `i/${id}/t/` }).promise();
  if (!res.Contents.length) return ['https://cdn.bken.io/files/default-thumbnail-sm.jpg'];
  return res.Contents.reduce((acc, { Key }) => {
    if (!Key.endsWith('/')) acc.push(`https://cdn.bken.io/${Key}`);
    return acc;
  }, []);
}

async function getVideosByUsername(username) {
  const user = await User.findOne({ username });
  return Video.find({ user: user.id });
}

async function getTidalVersionsById(id) {
  const [res, res2] = await Promise.all([
    ds3
      .listObjectsV2({
        Bucket: 'tidal',
        Delimiter: '/',
        Prefix: `segments/${id}/`,
      })
      .promise(),
    ws3
      .listObjectsV2({
        Bucket: 'cdn.bken.io',
        Prefix: `v/${id}`,
      })
      .promise(),
  ]);

  const inProgressPresets = res.CommonPrefixes.map(
    ({ Prefix }) => Prefix.split('/')[2].split('/')[0]
  );
  const cdnPresets = res2.Contents.map(({ Key }) => Key.split('/')[2].split('.')[0]);
  const presets = _.union(cdnPresets, inProgressPresets);

  // console.log('res', res);
  // console.log('res2', res2);
  // console.log('cdnPresets', cdnPresets);
  // console.log('inProgressPresets', inProgressPresets);
  // console.log('presets', presets);

  const finalPresets = presets.reduce((acc, cv) => {
    acc.push({
      preset: cv,
      status: cdnPresets.includes(cv) ? 'completed' : 'processing',
      link: cdnPresets.includes(cv) ? `https://cdn.bken.io/v/${id}/${cv}.mp4` : '',
    });
    return acc;
  }, []);

  return finalPresets.filter(({ preset }) => {
    return preset !== 'source';
  });
}

async function deleteVideo(id) {
  // TODO :: make sure that tidal is not processing before deleting

  const Bucket = 'cdn.bken.io';
  const [imageRes, videoRes] = await Promise.all([
    ws3.listObjectsV2({ Bucket, Prefix: `i/${id}` }).promise(),
    ws3.listObjectsV2({ Bucket, Prefix: `v/${id}` }).promise(),
  ]);

  const itemsToDelete = _.union(imageRes.Contents, videoRes.Contents);
  console.log('itemsToDelete', itemsToDelete);

  await Promise.all(
    itemsToDelete.map(({ Key }) => {
      console.log('deleting', Key);
      return ws3.deleteObject({ Bucket, Key }).promise();
    })
  );

  await Video.findByIdAndDelete(id);
  return true;
}

module.exports = {
  deleteVideo,
  getVideoById,
  getVideosByUsername,
  getTidalVersionsById,
  getTidalThumbnailsById,
};
