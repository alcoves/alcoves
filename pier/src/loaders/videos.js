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
  return Video.find({ user: user.id }).sort({ createdAt: -1 });
}

async function getTidalVersionsById(id) {
  // Should fetch more items, 1000 limit right now
  const [tidalPresets, totalSegments, cdnPresets] = await Promise.all([
    ds3
      .listObjectsV2({
        Bucket: 'tidal',
        Delimiter: '/',
        Prefix: `segments/${id}/`,
      })
      .promise()
      .then(({ CommonPrefixes }) => {
        return CommonPrefixes.map(({ Prefix }) => Prefix.split('/')[2].split('/')[0]);
      }),
    ds3
      .listObjectsV2({
        Bucket: 'tidal',
        Prefix: `segments/${id}/source/`,
      })
      .promise()
      .then(({ Contents }) => {
        return Contents.length;
      }),
    ws3
      .listObjectsV2({
        Bucket: 'cdn.bken.io',
        Prefix: `v/${id}`,
      })
      .promise()
      .then(({ Contents }) => {
        return Contents.map(({ Key }) => Key.split('/')[2].split('.')[0]);
      }),
  ]);

  const versions = await Promise.all(
    _.union(tidalPresets, cdnPresets)
      .filter(preset => {
        return preset !== 'source';
      })
      .map(async preset => {
        const { KeyCount: completedSegments } = await ds3
          .listObjectsV2({ Bucket: 'tidal', Prefix: `segments/${id}/${preset}` })
          .promise();

        return {
          preset,
          percentCompleted: (completedSegments / totalSegments) * 100,
          status: cdnPresets.includes(preset) ? 'completed' : 'processing',
          link: cdnPresets.includes(preset) ? `https://cdn.bken.io/v/${id}/${preset}.mp4` : '',
        };
      })
  );

  const status = versions.reduce((acc, cv) => {
    if (cv.percentCompleted !== 100) {
      acc = 'transcoding';
    } else {
      acc = 'completed';
    }

    return acc;
  }, 'uploaded');

  return {
    status,
    versions,
  };
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
