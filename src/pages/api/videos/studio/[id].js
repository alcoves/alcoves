import { getSession, } from 'next-auth/client';
import db from '../../../../utils/db';

// Returns video for an authenticated user
// consumed by the studio page
export default async function handler(req, res) {
  try {
    const session = await getSession({ req });
    if (session) {
      if (req.method === 'GET') {
        const videos = await db.user.findFirst({ 
          where: { videoId: req.query.id, userId: session.id },
        })
        res.send(videos)
      }

      if (req.method === 'PATCH') {
        // Update video
      }

      if (req.method === 'DELETE') {
        // Delete video
      }
    } else {
      res.status(401).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}