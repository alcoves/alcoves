import { s3, } from '../../../utils/s3';
import db from '../../../utils/db';

async function rename() {
  const dirs = await s3.listObjectsV2({
    Bucket: 'cdn.bken.io',
    Prefix: 'v/',
    Delimiter: '/',
  }).promise();

  const videosInCDN = dirs.CommonPrefixes.reduce((acc, { Prefix }) => {
    const videoId = Prefix.split('/')[1];
    acc[videoId] = videoId;
    return acc;
  }, {});

  const withOriginal = await Promise.all(dirs.CommonPrefixes.map(({ Prefix }) => {
    const videoId = Prefix.split('/')[1];
    return s3.listObjectsV2({
      Bucket: 'cdn.bken.io',
      Prefix: `v/${videoId}/original`,
    }).promise();
  }));

  const withoutOriginal = withOriginal.filter(({ Contents }) => {
    return !Contents.length;
  });

  console.log('withoutOriginal', withoutOriginal.length);

  const videos = await db.video.findMany();
   
  return {
    videos: videos.length,
    videosInCDN: dirs.CommonPrefixes.length,
    videosWithoutCDN: videos.filter(({ videoId }) => {
      return !videosInCDN[videoId];
    }),
  };
}

export default async function(req, res) {
  if (req.method === 'POST') {
    return res.json(await rename());
  }
}