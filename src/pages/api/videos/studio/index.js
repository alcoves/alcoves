import { getSession, } from 'next-auth/client';
import db from '../../../../utils/db';

// Returns all videos for an authenticated user
// consumed by the studio page
export default async function handler(req, res) {
  try {
    const session = await getSession({ req });
    if (session) {
      if (req.method === 'GET') {
        const videos = await db.video.findMany({
          where: { userId: session.id },
          orderBy: { createdAt: "desc" }
        });
        res.send(videos);
      }
    } else {
      res.status(401).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}