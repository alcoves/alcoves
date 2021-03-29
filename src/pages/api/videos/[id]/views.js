import { getSession, } from 'next-auth/client';
import db from '../../../../utils/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      console.log('logging video view');

      const session = await getSession({ req });
      const requestIP = req.headers['cf-connecting-ip'];
      if (!requestIP) return res.status(400).send(`invalid request ip: ${requestIP}`);

      const video = await db.video.findFirst({ where: { videoId: req.query.id } });
      if (!video) return res.status(404).end();
      if (video.duration <= 0) return res.status(400).end();

      const backdatedTimestamp = Date.now() - (video.duration * 1000);
      const recentView = await db.view.findFirst({ where: { videoId: req.query.id } });

      if (recentView) {
        return res.status(400).send('view too recent, not counted');
      }

      const data = {
        ip: requestIP,
        videoId: req.video.id,
      };

      if (session?.id) data.userId = session.id;
      await db.view.create({ data });
      // await db.video.update({  })
      return res.status(200).end();
    }
    res.status(400).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}