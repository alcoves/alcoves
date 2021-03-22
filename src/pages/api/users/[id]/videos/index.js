import { getSession, } from 'next-auth/client';
import db from '../../../../../utils/db';

// Returns all videos for an authenticated user
export default async function handler(req, res) {
  try {
    const session = await getSession({ req });
    if (!session) return res.status(401).end();
    if (req.query.id != session.id) return res.status(403).end();

    if (req.method === 'GET') {
      const videos = await db.video.findMany({
        where: { userId: parseInt(req.query.id) },
        orderBy: { createdAt: "desc" }
      });
      res.send(videos);
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}