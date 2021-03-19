import db from '../../../utils/db';
import { s3 } from '../../../utils/s3';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const video = await db.video.findFirst({ where: { videoId: req.query.id } });
      if (!video) return res.status(404).end();

      const { Body } = await s3.getObject({
        Bucket: 'cdn.bken.io',
        Key: `v/${req.query.id}/meta.json`
      }).promise()
      const tidalMeta = JSON.parse(Body)

      const updatedVideo = {
        ...video,
        status: tidalMeta.status,
        duration: tidalMeta.duration,
        thumbnail: tidalMeta.thumbnail,
        hlsMasterLink: tidalMeta.hlsMasterLink,
        percentCompleted: tidalMeta.percentCompleted,
      }
;
      await db.video.update({
        where: { videoId: req.query.id },
        data: updatedVideo
      })
      return res.json(updatedVideo)
    }
    res.status(400).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}