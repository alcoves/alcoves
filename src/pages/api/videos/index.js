import db from '../../../utils/db';
import createVideo from '../../../api/createVideo';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rows } = await db.query(`select * from videos where visibility = 'public' order by created_at asc`)
    res.send(rows)
  }

  // User is completing a multipart upload
  if (req.method === 'POST') {
    return createVideo(req, res)
  }
}