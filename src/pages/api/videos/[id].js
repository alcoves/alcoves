import { Pool } from 'pg';
import { getSession } from 'next-auth/client'

const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({ connectionString });

export default async function handler(req, res) {
  try {
    // const session = await getSession({ req })
    if (req.method === 'GET') {
      const { rows } = await pool.query(`select * from videos where video_id = $1`, [req.query.id])
      rows.length ? res.send(rows[0]) : res.sendStatus(404)
      // return pool.end()
      //   if (session) {
      // console.log('Session', JSON.stringify(session, null, 2))
      // } else {
      //   return res.sendStatus(401)
      // }
    }
    res.status(400).end()
  } catch (error) {
    return res.status(500).end()
  }
}