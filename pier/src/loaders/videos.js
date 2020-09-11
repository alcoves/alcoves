const _ = require('lodash');
const Video = require('../models/Video');
const ds3 = require('../config/ds3');
const ws3 = require('../config/ws3');

function getVideoById(id) {
  return Video.findById(id);
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

module.exports = {
  getVideoById,
  getTidalVersionsById,
};
