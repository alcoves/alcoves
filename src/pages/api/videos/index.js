import createVideo from '../../../api/createVideo';
import db from '../../../utils/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const videos = await db.video.findMany({ where: { visibility: 'public' } });
      return res.json(videos);
    }

    // User is completing a multipart upload
    if (req.method === 'POST') {
      return createVideo(req, res);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}