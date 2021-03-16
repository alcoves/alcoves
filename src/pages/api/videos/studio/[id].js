import { getSession, } from 'next-auth/client';
import db from '../../../../utils/db';

// Returns video for an authenticated user
// consumed by the studio page
export default async function handler(req, res) {
  try {
    const session = await getSession({ req });
    if (session) {
      if (req.method === 'GET') {
        const { rows } = await db.query('select * from videos where video_id = $1 and user_id = $2', [req.query.id, session.id]);
        res.send(rows[0]);
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