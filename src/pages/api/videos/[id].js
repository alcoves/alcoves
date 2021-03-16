import db from '../../../utils/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await db.query('select * from videos where video_id = $1', [req.query.id]);
      rows.length ? res.send(rows[0]) : res.status(404).end();
    }
    res.status(400).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}