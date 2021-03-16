import db from '../../../utils/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await db.query(`select * from videos where visibility = 'public' order by created_at asc`)
      res.send(rows)
    }
    res.status(400).end()
  } catch (error) {
    console.error(error);
    return res.status(500).end()
  }
}